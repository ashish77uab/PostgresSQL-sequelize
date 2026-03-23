'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Organizations', [
      {
        name: 'Google',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Microsoft',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Amazon',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Organizations', {
      name: ['Google', 'Microsoft', 'Amazon']
    });
  }
};