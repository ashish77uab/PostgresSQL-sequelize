import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const register = async (data) => {
  const existing = await db.User.findOne({ where: { email: data.email } });
  if (existing) {
    throw new Error('Email already exists');
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await db.User.create({
    name: data.name,
    email: data.email,
    password: hashed,
    role: 'USER'
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret'
  );

  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret'
  );

  return { user, token };
};
