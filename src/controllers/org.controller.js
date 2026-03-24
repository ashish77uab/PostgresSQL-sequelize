import * as orgService from '../services/org.service.js';

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await orgService.getOrganizations();
    res.json(organizations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sponsor = async (req, res) => {
  try {
    const result = await orgService.sponsorUser(
      req.body.orgId,
      req.body.userId,
      req.body.sessionId
    );
    res.json({ message: 'Sponsored successfully', enrollment: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
