import express from 'express';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import orgRoutes from './routes/org.routes.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/session', sessionRoutes);
app.use('/org', orgRoutes);

export default app;
