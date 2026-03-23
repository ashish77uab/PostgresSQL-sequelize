const defineProfile = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    age: DataTypes.INTEGER,
    education: DataTypes.STRING
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User);
  };

  return Profile;
};

export default defineProfile;
