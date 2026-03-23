const defineEnrollment = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    'Enrollment',
    {
      paymentStatus: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'SPONSORED'),
        defaultValue: 'PENDING'
      },
      amount: {
        type: DataTypes.FLOAT,
        defaultValue: 100
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['UserId', 'SessionId']
        }
      ]
    }
  );

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.User);
    Enrollment.belongsTo(models.Session);
  };

  return Enrollment;
};

export default defineEnrollment;
