'use strict';

const bcrypt = require('bcrypt');

const SUPERADMIN_EMAIL = 'superadmin@gmail.com';
const SUPERADMIN_PASSWORD = 'Admin@123';

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

    // Check if already exists
    const existing = await queryInterface.sequelize.query(
      `SELECT * FROM "Users" WHERE email = :email LIMIT 1`,
      {
        replacements: { email: SUPERADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (existing.length > 0) {
      // Update existing
      await queryInterface.bulkUpdate(
        'Users',
        {
          name: 'Super Admin',
          password: hashedPassword,
          role: 'SUPERADMIN',
          isProfileComplete: true,
          updatedAt: new Date()
        },
        { email: SUPERADMIN_EMAIL }
      );

      console.log(`Updated superadmin: ${SUPERADMIN_EMAIL}`);
    } else {
      // Insert new
      await queryInterface.bulkInsert('Users', [
        {
          name: 'Super Admin',
          email: SUPERADMIN_EMAIL,
          password: hashedPassword,
          role: 'SUPERADMIN',
          isProfileComplete: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      console.log(`Created superadmin: ${SUPERADMIN_EMAIL}`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: SUPERADMIN_EMAIL
    });

    console.log(`Deleted superadmin: ${SUPERADMIN_EMAIL}`);
  }
};