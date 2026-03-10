import { Request, Response } from 'express';
import pool from '../db';

// Get products for a specific runner
export const getRunnerProducts = async (req: Request, res: Response) => {
  const { runnerId } = req.params;

  // Validate runnerId
  if (!runnerId || isNaN(parseInt(runnerId))) {
    return res.status(400).json({ error: "Invalid runner ID" });
  }

  try {
    console.log(`Fetching products for runner ID: ${runnerId}`);
    
    // First, check if the runner exists
    const runnerCheck = await pool.query(
      'SELECT runner_id FROM runnerprofile WHERE runner_id = $1',
      [runnerId]
    );
    
    if (runnerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Runner not found" });
    }
    
    // Correct query with proper JOIN using category_id
    const query = `
      SELECT 
        p.product_id,
        p.runner_id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.runner_id = $1
      ORDER BY p.product_id
    `;

    const result = await pool.query(query, [runnerId]);
    
    console.log(`Found ${result.rows.length} products for runner ${runnerId}`);
    res.json(result.rows);
  } catch (err: any) {
    console.error("Error in getRunnerProducts:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ 
      error: "Database error occurred",
      details: err.message 
    });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const query = `
      SELECT 
        p.product_id,
        p.runner_id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.category_id,
        c.name as category_name,
        r.username as runner_name,
        r.city as runner_city
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN runnerprofile r ON p.runner_id = r.runner_id
      WHERE p.product_id = $1
    `;

    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add a new product (for runners to list items)
export const addProduct = async (req: Request, res: Response) => {
  const { runner_id, category_id, title, description, image_url, price } = req.body;

  // Validate required fields
  if (!runner_id || !title || !price) {
    return res.status(400).json({ message: "runner_id, title, and price are required" });
  }

  try {
    // Check if runner exists
    const runnerCheck = await pool.query(
      'SELECT runner_id FROM runnerprofile WHERE runner_id = $1',
      [runner_id]
    );
    
    if (runnerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Runner not found" });
    }

    // If category_id is provided, check if it exists
    if (category_id) {
      const categoryCheck = await pool.query(
        'SELECT category_id FROM categories WHERE category_id = $1',
        [category_id]
      );
      
      if (categoryCheck.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    const query = `
      INSERT INTO products (runner_id, category_id, title, description, image_url, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await pool.query(query, [runner_id, category_id, title, description, image_url, price]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("Error adding product:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { title, description, price, image_url, category_id } = req.body;

  try {
    const query = `
      UPDATE products
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          image_url = COALESCE($4, image_url),
          category_id = COALESCE($5, category_id)
      WHERE product_id = $6
      RETURNING *
    `;

    const result = await pool.query(query, [title, description, price, image_url, category_id, productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const query = 'DELETE FROM products WHERE product_id = $1 RETURNING *';
    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ error: err.message });
  }
};