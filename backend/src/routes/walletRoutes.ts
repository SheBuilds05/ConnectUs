import { Router } from 'express';
import pool from '../db';

const router = Router();

// Helper function to get available balance
const getAvailableBalance = async (userId: number): Promise<number> => {
  const result = await pool.query(`
    SELECT 
      COALESCE((SELECT SUM(amount) FROM payments 
                WHERE user_id = $1 AND type = 'credit' AND status = 'completed'), 0) as total_credited,
      COALESCE((SELECT SUM(amount) FROM payments 
                WHERE user_id = $1 AND type = 'debit' AND status = 'completed'), 0) as total_debited,
      COALESCE((SELECT SUM(amount) FROM payment_holds 
                WHERE user_id = $1 AND status = 'pending'), 0) as total_held
  `, [userId]);

  const totalCredited = parseFloat(result.rows[0].total_credited);
  const totalDebited = parseFloat(result.rows[0].total_debited);
  const totalHeld = parseFloat(result.rows[0].total_held);
  
  return totalCredited - totalDebited - totalHeld;
};

// Create a hold for a booking
router.post('/wallet/hold', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { booking_id, amount } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!booking_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid booking or amount' });
  }

  try {
    // Check available balance
    const availableBalance = await getAvailableBalance(parseInt(userId));
    
    if (availableBalance < amount) {
      return res.status(400).json({ 
        error: 'Insufficient balance', 
        available: availableBalance,
        required: amount 
      });
    }

    // Create hold
    const result = await pool.query(`
      INSERT INTO payment_holds (user_id, booking_id, amount, status, created_at)
      VALUES ($1, $2, $3, 'pending', NOW())
      RETURNING *
    `, [userId, booking_id, amount]);

    res.json({
      success: true,
      data: {
        hold_id: result.rows[0].hold_id,
        amount: amount,
        message: `R${amount} has been placed on hold for booking #${booking_id}`,
      },
    });
  } catch (error: any) {
    console.error('Error creating hold:', error);
    res.status(500).json({ error: error.message });
  }
});

// Capture hold (when runner accepts)
router.post('/wallet/capture/:holdId', async (req, res) => {
  const { holdId } = req.params;

  try {
    const hold = await pool.query(
      `SELECT * FROM payment_holds WHERE hold_id = $1 AND status = 'pending'`,
      [holdId]
    );

    if (hold.rows.length === 0) {
      return res.status(404).json({ error: 'Hold not found or already processed' });
    }

    const holdData = hold.rows[0];

    // Create permanent payment record
    await pool.query(
      `INSERT INTO payments (user_id, booking_id, amount, type, status, description, paid_at)
       VALUES ($1, $2, $3, 'debit', 'completed', $4, NOW())`,
      [holdData.user_id, holdData.booking_id, holdData.amount, `Payment for booking #${holdData.booking_id}`]
    );

    // Update hold status
    await pool.query(
      `UPDATE payment_holds SET status = 'captured', updated_at = NOW() WHERE hold_id = $1`,
      [holdId]
    );

    res.json({
      success: true,
      message: `Payment of R${holdData.amount} captured successfully`,
    });
  } catch (error: any) {
    console.error('Error capturing hold:', error);
    res.status(500).json({ error: error.message });
  }
});

// Release hold (when runner rejects)
router.post('/wallet/release/:holdId', async (req, res) => {
  const { holdId } = req.params;

  try {
    const hold = await pool.query(
      `SELECT * FROM payment_holds WHERE hold_id = $1 AND status = 'pending'`,
      [holdId]
    );

    if (hold.rows.length === 0) {
      return res.status(404).json({ error: 'Hold not found or already processed' });
    }

    await pool.query(
      `UPDATE payment_holds SET status = 'released', updated_at = NOW() WHERE hold_id = $1`,
      [holdId]
    );

    res.json({
      success: true,
      message: `Hold of R${hold.rows[0].amount} released. Funds are now available in your wallet.`,
    });
  } catch (error: any) {
    console.error('Error releasing hold:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get wallet balance (including holds)
router.get('/wallet/balance', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        COALESCE((SELECT SUM(amount) FROM payments 
                  WHERE user_id = $1 AND type = 'credit' AND status = 'completed'), 0) as total_credited,
        COALESCE((SELECT SUM(amount) FROM payments 
                  WHERE user_id = $1 AND type = 'debit' AND status = 'completed'), 0) as total_debited,
        COALESCE((SELECT SUM(amount) FROM payment_holds 
                  WHERE user_id = $1 AND status = 'pending'), 0) as total_held
    `, [userId]);

    const totalCredited = parseFloat(result.rows[0].total_credited);
    const totalDebited = parseFloat(result.rows[0].total_debited);
    const totalHeld = parseFloat(result.rows[0].total_held);
    const availableBalance = totalCredited - totalDebited - totalHeld;

    res.json({
      success: true,
      data: {
        balance: availableBalance,
        total_credited: totalCredited,
        total_debited: totalDebited,
        total_held: totalHeld,
      },
    });
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction history
router.get('/wallet/transactions', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const payments = await pool.query(`
      SELECT 
        payment_id as id,
        amount,
        type,
        status,
        description,
        paid_at as created_at
      FROM payments 
      WHERE user_id = $1
      ORDER BY paid_at DESC
    `, [userId]);

    const holds = await pool.query(`
      SELECT 
        hold_id as id,
        amount,
        'hold' as type,
        status,
        'Hold for booking #' || booking_id as description,
        created_at
      FROM payment_holds 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    const allTransactions = [...payments.rows, ...holds.rows];
    allTransactions.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json({ success: true, data: allTransactions });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add funds to wallet
router.post('/wallet/add-funds', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { amount } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO payments (user_id, amount, type, status, description, paid_at)
      VALUES ($1, $2, 'credit', 'completed', $3, NOW())
      RETURNING payment_id
    `, [userId, amount, `Wallet top-up of R${amount}`]);

    res.json({
      success: true,
      data: {
        payment_id: result.rows[0].payment_id,
        amount: amount,
        message: `Successfully added R${amount} to your wallet`,
      },
    });
  } catch (error: any) {
    console.error('Error adding funds:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;