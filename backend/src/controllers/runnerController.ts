import { Request, Response } from 'express';
import pool from '../db';

// Get all verified runners
export const getRunners = async (req: Request, res: Response) => {
  try {
    const { city, limit = 20 } = req.query;

    let query = `
      SELECT 
        runner_id,
        username,
        email,
        completed_bookings_count,
        verification_status,
        city,
        profile_photo,
        bio,
        languages,
        id_verified
      FROM runnerprofile
      WHERE verification_status = 'VERIFIED'
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND city ILIKE $${paramIndex}`;
      queryParams.push(`%${city}%`);
      paramIndex++;
    }

    query += ` ORDER BY completed_bookings_count DESC LIMIT $${paramIndex}`;
    queryParams.push(limit);

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err: any) {
    console.error("Error fetching runners:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get runner by ID
export const getRunnerById = async (req: Request, res: Response) => {
  const { runnerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        runner_id,
        username,
        email,
        completed_bookings_count,
        verification_status,
        address,
        city,
        postal_code,
        profile_photo,
        bio,
        languages,
        id_verified,
        created_at
      FROM runnerprofile
      WHERE runner_id = $1`,
      [runnerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Runner not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error fetching runner:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update runner profile
export const updateRunnerProfile = async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  const { bio, city, phone, profile_photo, languages } = req.body;

  try {
    const result = await pool.query(
      `UPDATE runnerprofile 
       SET bio = COALESCE($1, bio),
           city = COALESCE($2, city),
           phone = COALESCE($3, phone),
           profile_photo = COALESCE($4, profile_photo),
           languages = COALESCE($5, languages),
           updated_at = CURRENT_TIMESTAMP
       WHERE runner_id = $6
       RETURNING runner_id, username, email, city, bio, profile_photo, languages`,
      [bio, city, phone, profile_photo, languages, runnerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Runner not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error updating runner:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get runner stats
export const getRunnerStats = async (req: Request, res: Response) => {
  const { runnerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        completed_bookings_count,
        verification_status,
        id_verified,
        created_at as joined_date
      FROM runnerprofile
      WHERE runner_id = $1`,
      [runnerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Runner not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error fetching runner stats:", err.message);
    res.status(500).json({ error: err.message });
  }
};