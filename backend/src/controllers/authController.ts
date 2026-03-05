import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, id_num } = req.body;
  const full_name = `${firstName} ${lastName}`;

  try {
    // 1. Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Updated INSERT: Removed 'role' because it doesn't exist in your DB.
    // Using 'full_name', 'email', 'password_hash', and 'id_num' which are in your schema.
    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, id_num) 
       VALUES ($1, $2, $3, $4) 
       RETURNING user_id, full_name, email`,
      [full_name, email, hashedPassword, id_num]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err: any) {
    console.error("DATABASE ERROR:", err.message);
    // This sends the actual database error to your frontend error box
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const user = result.rows[0];

    // Use password_hash to match schema
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user.user_id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.user_id, 
        name: user.full_name, 
        email: user.email 
      } 
    });
  } catch (err: any) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};