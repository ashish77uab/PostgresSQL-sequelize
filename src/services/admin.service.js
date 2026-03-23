import bcrypt from 'bcrypt';
import db from '../models/index.js';

const SESSION_DURATION_DAYS = 30;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export const createAdminWithSession = async ({ name, email, password }) => {
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const now = new Date();
  const activeSession = await db.Session.findOne({
    where: {
      startDate: { [db.Sequelize.Op.lte]: now },
      endDate: { [db.Sequelize.Op.gte]: now }
    }
  });

  if (activeSession) {
    throw new Error('An active admin session already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return db.sequelize.transaction(async (transaction) => {
    const admin = await db.User.create(
      {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      },
      { transaction }
    );

    const session = await db.Session.create(
      {
        adminId: admin.id,
        startDate: now,
        endDate: addDays(now, SESSION_DURATION_DAYS),
        status: 'ACTIVE'
      },
      { transaction }
    );

    return { admin, session };
  });
};
