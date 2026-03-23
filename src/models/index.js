import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import defineUser from './user.js';
import defineSession from './session.js';
import defineEnrollment from './enrollment.js';
import defineOrganization from './organization.js';
import defineSponsorship from './sponsorship.js';
import defineProfile from './profile.js';
import defineVideo from './video.js';
import defineQuiz from './quiz.js';
import defineQuizAttempt from './quizAttempt.js';
import defineVideoWatch from './videoWatch.js';

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = defineUser(sequelize, DataTypes);
db.Session = defineSession(sequelize, DataTypes);
db.Enrollment = defineEnrollment(sequelize, DataTypes);
db.Organization = defineOrganization(sequelize, DataTypes);
db.Sponsorship = defineSponsorship(sequelize, DataTypes);
db.Profile = defineProfile(sequelize, DataTypes);
db.Video = defineVideo(sequelize, DataTypes);
db.Quiz = defineQuiz(sequelize, DataTypes);
db.QuizAttempt = defineQuizAttempt(sequelize, DataTypes);
db.VideoWatch = defineVideoWatch(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});

export default db;
