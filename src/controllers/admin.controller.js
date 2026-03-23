import * as adminService from '../services/admin.service.js';

export const createAdmin = async (req, res) => {
  try {
    const result = await adminService.createAdminWithSession(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
