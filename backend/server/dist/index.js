import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import bookingsRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import reviewsRoutes from './routes/reviews.js';
import reportsRoutes from './routes/reports.js';
import { initDb, seedSampleData } from './db.js';
dotenv.config();
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (_, res) => {
    res.send('Backend API is running 🚀');
});
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok' });
});
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
initDb()
    .then(() => seedSampleData())
    .then(() => {
    app.listen(port, () => {
        console.log(`Backend démarré sur http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error('Échec de l’initialisation de la base de données :', error);
    process.exit(1);
});
