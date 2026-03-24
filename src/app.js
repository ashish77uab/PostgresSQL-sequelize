import express from 'express';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import orgRoutes from './routes/org.routes.js';
import { bullBoardRouter } from './jobs/index.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/session', sessionRoutes);
app.use('/org', orgRoutes);
app.use('/admin/queues', bullBoardRouter);

app.use((req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error('Unhandled application error:', error.message);

    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    return res.status(error.statusCode || 500).json({
        message: error.message || 'Internal server error'
    });
});

export default app;
