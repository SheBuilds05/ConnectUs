import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);

app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});