import db from '../models/index.js';

const { Op } = db.Sequelize;
const ENROLLMENT_AMOUNT = 100;

const toDateOnly = (value) => value.toISOString().slice(0, 10);

const getSessionDayNumber = (session) => {
  const start = new Date(session.startDate);
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / msPerDay) + 1;
};

export const refreshSessionStatuses = async () => {
  const now = new Date();
  await db.Session.update(
    { status: 'EXPIRED' },
    {
      where: {
        endDate: { [Op.lt]: now },
        status: { [Op.ne]: 'EXPIRED' }
      }
    }
  );

  await db.Session.update(
    { status: 'UPCOMING' },
    {
      where: {
        startDate: { [Op.gt]: now }
      }
    }
  );

  await db.Session.update(
    { status: 'ACTIVE' },
    {
      where: {
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now }
      }
    }
  );
};

export const getActiveSession = async () => {
  await refreshSessionStatuses();
  const now = new Date();
  return db.Session.findOne({
    where: {
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now }
    },
    order: [['startDate', 'DESC']]
  });
};

const getActiveEnrollment = async (userId) => {
  const activeSession = await getActiveSession();
  if (!activeSession) {
    throw new Error('No active session');
  }

  const enrollment = await db.Enrollment.findOne({
    where: {
      UserId: userId,
      SessionId: activeSession.id
    }
  });

  if (!enrollment) {
    throw new Error('User is not enrolled in active session');
  }

  return { enrollment, activeSession };
};

export const enroll = async (userId, sessionId) => {
  const activeSession = await getActiveSession();
  if (!activeSession) {
    throw new Error('No active session');
  }

  if (sessionId && Number(sessionId) !== activeSession.id) {
    throw new Error('Enrollment is allowed only for the active session');
  }

  const [enrollment] = await db.Enrollment.findOrCreate({
    where: {
      UserId: userId,
      SessionId: activeSession.id
    },
    defaults: {
      paymentStatus: 'PAID',
      amount: ENROLLMENT_AMOUNT
    }
  });

  return enrollment;
};

export const createVideoForDay = async (adminUser, payload) => {
  const session = await getActiveSession();
  if (!session) {
    throw new Error('No active session');
  }

  if (adminUser.role === 'ADMIN' && session.adminId !== adminUser.id) {
    throw new Error('Admin can manage only their own active session');
  }

  const existing = await db.Video.findOne({
    where: {
      SessionId: session.id,
      dayNumber: payload.dayNumber
    }
  });

  if (existing) {
    throw new Error('Video already exists for this day');
  }

  return db.Video.create({
    title: payload.title,
    url: payload.url,
    durationInSeconds: payload.durationInSeconds || 0,
    dayNumber: payload.dayNumber,
    SessionId: session.id
  });
};

export const createQuizForDay = async (adminUser, payload) => {
  const session = await getActiveSession();
  if (!session) {
    throw new Error('No active session');
  }

  if (adminUser.role === 'ADMIN' && session.adminId !== adminUser.id) {
    throw new Error('Admin can manage only their own active session');
  }

  const existing = await db.Quiz.findOne({
    where: {
      SessionId: session.id,
      dayNumber: payload.dayNumber
    }
  });

  if (existing) {
    throw new Error('Quiz already exists for this day');
  }

  return db.Quiz.create({
    title: payload.title,
    totalMarks: payload.totalMarks || 100,
    dayNumber: payload.dayNumber,
    SessionId: session.id
  });
};

export const getTodayContent = async (userId) => {
  const { activeSession } = await getActiveEnrollment(userId);
  const dayNumber = getSessionDayNumber(activeSession);

  const video = await db.Video.findOne({
    where: {
      SessionId: activeSession.id,
      dayNumber
    }
  });

  const quiz = await db.Quiz.findOne({
    where: {
      SessionId: activeSession.id,
      dayNumber
    }
  });

  return {
    sessionId: activeSession.id,
    dayNumber,
    video,
    quiz
  };
};

export const watchTodayVideo = async (userId) => {
  const { activeSession } = await getActiveEnrollment(userId);
  const dayNumber = getSessionDayNumber(activeSession);
  const today = toDateOnly(new Date());

  const video = await db.Video.findOne({
    where: {
      SessionId: activeSession.id,
      dayNumber
    }
  });

  if (!video) {
    throw new Error('No video published for today');
  }

  const [watch, created] = await db.VideoWatch.findOrCreate({
    where: {
      UserId: userId,
      SessionId: activeSession.id,
      watchedOn: today
    },
    defaults: {
      VideoId: video.id
    }
  });

  if (!created) {
    throw new Error('Daily video already watched');
  }

  return watch;
};

export const attemptTodayQuiz = async (userId, score) => {
  const { activeSession } = await getActiveEnrollment(userId);
  const dayNumber = getSessionDayNumber(activeSession);
  const today = toDateOnly(new Date());

  const quiz = await db.Quiz.findOne({
    where: {
      SessionId: activeSession.id,
      dayNumber
    }
  });

  if (!quiz) {
    throw new Error('No quiz published for today');
  }

  const existingAttempt = await db.QuizAttempt.findOne({
    where: {
      UserId: userId,
      SessionId: activeSession.id,
      attemptedOn: today
    }
  });

  if (existingAttempt) {
    throw new Error('Daily quiz already attempted');
  }

  return db.QuizAttempt.create({
    UserId: userId,
    QuizId: quiz.id,
    SessionId: activeSession.id,
    score,
    status: 'SUBMITTED',
    attemptedOn: today
  });
};

export const getScores = async (userId) => {
  return db.QuizAttempt.findAll({
    where: { UserId: userId },
    include: [
      { model: db.Quiz, attributes: ['id', 'title', 'dayNumber', 'totalMarks'] },
      { model: db.Session, attributes: ['id', 'startDate', 'endDate', 'status'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const getHistory = async (userId) => {
  const enrollments = await db.Enrollment.findAll({
    where: { UserId: userId },
    include: [{ model: db.Session, attributes: ['id', 'startDate', 'endDate', 'status'] }],
    order: [['createdAt', 'DESC']]
  });

  const quizAttempts = await db.QuizAttempt.findAll({
    where: { UserId: userId },
    include: [{ model: db.Quiz, attributes: ['id', 'title', 'dayNumber'] }],
    order: [['createdAt', 'DESC']]
  });

  const videoWatches = await db.VideoWatch.findAll({
    where: { UserId: userId },
    include: [{ model: db.Video, attributes: ['id', 'title', 'dayNumber'] }],
    order: [['createdAt', 'DESC']]
  });

  return { enrollments, quizAttempts, videoWatches };
};
