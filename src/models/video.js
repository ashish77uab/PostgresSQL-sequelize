const defineVideo = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    durationInSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dayNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Video.associate = (models) => {
    Video.belongsTo(models.Session);
    Video.hasMany(models.Quiz);
    Video.hasMany(models.VideoWatch);
  };

  return Video;
};

export default defineVideo;
