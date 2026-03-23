import db from '../models/index.js';
import { getActiveSession } from './session.service.js';

const SPONSOR_AMOUNT = 100;

export const sponsorUser = async (orgId, userId, sessionId) => {
  const organization = await db.Organization.findByPk(orgId);
  if (!organization) {
    throw new Error('Organization not found');
  }

  const targetSession = sessionId
    ? await db.Session.findByPk(sessionId)
    : await getActiveSession();

  if (!targetSession) {
    throw new Error('Session not found');
  }

  const existingEnrollment = await db.Enrollment.findOne({
    where: {
      UserId: userId,
      SessionId: targetSession.id
    }
  });

  if (existingEnrollment) {
    return existingEnrollment;
  }

  if (organization.balance < SPONSOR_AMOUNT) {
    throw new Error('Insufficient balance');
  }

  return db.sequelize.transaction(async (transaction) => {
    organization.balance -= SPONSOR_AMOUNT;
    await organization.save({ transaction });

    await db.Sponsorship.create(
      {
        OrganizationId: organization.id,
        userId,
        sessionId: targetSession.id,
        amount: SPONSOR_AMOUNT
      },
      { transaction }
    );

    return db.Enrollment.create(
      {
        UserId: userId,
        SessionId: targetSession.id,
        paymentStatus: 'SPONSORED',
        amount: SPONSOR_AMOUNT
      },
      { transaction }
    );
  });
};
