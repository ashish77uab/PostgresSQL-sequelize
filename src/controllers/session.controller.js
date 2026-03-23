import * as sessionService from '../services/session.service.js';

export const enroll = async (req, res) => {
  try {
    const result = await sessionService.enroll(req.user.id, req.body.sessionId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    const result = await sessionService.createVideoForDay(req.user, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const result = await sessionService.createQuizForDay(req.user, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTodayContent = async (req, res) => {
  try {
    const result = await sessionService.getTodayContent(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const watchTodayVideo = async (req, res) => {
  try {
    const result = await sessionService.watchTodayVideo(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const attemptTodayQuiz = async (req, res) => {
  try {
    const result = await sessionService.attemptTodayQuiz(req.user.id, req.body.score);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getScores = async (req, res) => {
  try {
    const result = await sessionService.getScores(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const result = await sessionService.getHistory(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
