const defineUser = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      defaultValue: 'Male'
    },
    role: {
      type: DataTypes.ENUM('SUPERADMIN', 'ADMIN', 'USER', 'ORG_ADMIN'),
      defaultValue: 'USER'
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  User.associate = (models) => {
    User.belongsToMany(models.Session, { through: models.Enrollment });
    User.hasMany(models.Enrollment);
    User.hasOne(models.Profile);
    User.hasMany(models.QuizAttempt);
    User.hasMany(models.VideoWatch);
  };

  return User;
};

export default defineUser;
