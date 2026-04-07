import { Request, Response } from 'express';
import pool from '../db';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT user_id, full_name, email, role, created_at, is_blocked FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRunners = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT runner_id, username, email, verification_status, is_blocked FROM runnerprofile');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBlockStatus = async (req: Request, res: Response) => {
  const { type, id } = req.params;
  const { blocked } = req.body;
  const table = type === 'user' ? 'users' : 'runnerprofile';
  const idCol = type === 'user' ? 'user_id' : 'runner_id';

  try {
    await pool.query(`UPDATE ${table} SET is_blocked = $1 WHERE ${idCol} = $2`, [blocked, id]);
    res.json({ message: `Status updated to ${blocked ? 'Blocked' : 'Active'}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEntity = async (req: Request, res: Response) => {
  const { type, id } = req.params;
  const table = type === 'user' ? 'users' : 'runnerprofile';
  const idCol = type === 'user' ? 'user_id' : 'runner_id';

  try {
    await pool.query(`DELETE FROM ${table} WHERE ${idCol} = $1`, [id]);
    res.json({ message: "Entity removed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};