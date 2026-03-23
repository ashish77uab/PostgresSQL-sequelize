const defineOrganization = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    name: DataTypes.STRING,
    balance: DataTypes.FLOAT
  });

  Organization.associate = (models) => {
    Organization.hasMany(models.Sponsorship);
  };

  return Organization;
};

export default defineOrganization;
