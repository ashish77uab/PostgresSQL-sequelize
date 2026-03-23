const defineSponsorship = (sequelize, DataTypes) => {
  const Sponsorship = sequelize.define('Sponsorship', {
    amount: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    sessionId: DataTypes.INTEGER
  });

  Sponsorship.associate = (models) => {
    Sponsorship.belongsTo(models.Organization);
  };

  return Sponsorship;
};

export default defineSponsorship;
