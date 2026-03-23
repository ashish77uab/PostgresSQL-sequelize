const defineQuiz = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    dayNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Video);
    Quiz.belongsTo(models.Session);
    Quiz.hasMany(models.QuizAttempt);
  };

  return Quiz;
};

export default defineQuiz;
