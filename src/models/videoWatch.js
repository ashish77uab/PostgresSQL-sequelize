const defineVideoWatch = (sequelize, DataTypes) => {
  const VideoWatch = sequelize.define(
    'VideoWatch',
    {
      watchedOn: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['UserId', 'SessionId', 'watchedOn']
        }
      ]
    }
  );

  VideoWatch.associate = (models) => {
    VideoWatch.belongsTo(models.User);
    VideoWatch.belongsTo(models.Session);
    VideoWatch.belongsTo(models.Video);
  };

  return VideoWatch;
};

export default defineVideoWatch;
