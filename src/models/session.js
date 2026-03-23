const defineSession = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'UPCOMING'),
      defaultValue: 'UPCOMING'
    },
    adminId: DataTypes.INTEGER
  });

  Session.associate = (models) => {
    Session.belongsToMany(models.User, { through: models.Enrollment });
    Session.hasMany(models.Enrollment);
    Session.hasMany(models.Video);
    Session.hasMany(models.Quiz);
    Session.hasMany(models.QuizAttempt);
    Session.hasMany(models.VideoWatch);
  };

  return Session;
};

export default defineSession;
