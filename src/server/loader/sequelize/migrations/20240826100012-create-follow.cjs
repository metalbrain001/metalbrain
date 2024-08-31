'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Follows', {
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // Ensure 'Users' matches your User table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      following_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // Ensure 'Users' matches your User table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add composite primary key
    await queryInterface.addConstraint('Follows', {
      fields: ['follower_id', 'following_id'],
      type: 'primary key',
      name: 'follows_pkey', // Optional: Custom name for the primary key constraint
    });

    // Add indexes to optimize follower and following queries
    await queryInterface.addIndex('Follows', ['follower_id']);
    await queryInterface.addIndex('Follows', ['following_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Follows');
  },
};
