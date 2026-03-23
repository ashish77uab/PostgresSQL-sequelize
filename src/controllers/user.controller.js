import db from '../models/index.js';
import * as sessionService from '../services/session.service.js';

export const completeProfile = async (req, res) => {
  try {
    const session = await sessionService.getActiveSession();
    if (!session) {
      return res.status(400).json({ message: 'No active session' });
    }

    const existingProfile = await db.Profile.findOne({ where: { UserId: req.user.id } });
    if (existingProfile) {
      await existingProfile.update(req.body);
    } else {
      await db.Profile.create({ ...req.body, UserId: req.user.id });
    }

    return res.json({ message: 'Profile completed' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
