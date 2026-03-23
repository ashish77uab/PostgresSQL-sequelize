const defineQuizAttempt = (sequelize, DataTypes) => {
  const QuizAttempt = sequelize.define('QuizAttempt', {
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('IN_PROGRESS', 'SUBMITTED'),
      defaultValue: 'IN_PROGRESS'
    },
    attemptedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  });

  QuizAttempt.associate = (models) => {
    QuizAttempt.belongsTo(models.User);
    QuizAttempt.belongsTo(models.Quiz);
    QuizAttempt.belongsTo(models.Session);
  };

  return QuizAttempt;
};

export default defineQuizAttempt;
