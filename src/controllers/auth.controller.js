import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const data = await authService.register(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
