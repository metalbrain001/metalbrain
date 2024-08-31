'use strict';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConInstance } from '../../sequelizeCon.js';

interface AdminAttributes {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  reset_password_token: string;
  reset_password_expires: Date;
  avatarUrl: string;
  profilePic: string;
  last_login: Date;
  role: string;
  created_at: Date;
  admin_registrationid: number;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

const sequelize = sequelizeConInstance();

class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare reset_password_token: string;
  declare reset_password_expires: Date;
  declare avatarUrl: string;
  declare profilePic: string;
  declare last_login: Date;
  declare role: string;
  declare created_at: Date;
  declare admin_registrationid: number;

  static async generateAvatarUrl(
    firstName: string,
    lastName: string
  ): Promise<string> {
    const name = `${firstName} ${lastName}`;
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
  }
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: async (value: string) => {
          const admin = await Admin.findOne({ where: { username: value } });
          if (admin) {
            throw new Error('Username already in use');
          }
        },
        len: [3, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        isUnique: async (value: string) => {
          const admin = await Admin.findOne({ where: { email: value } });
          if (admin) {
            throw new Error('Email already in use');
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    last_login: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    admin_registrationid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AdminRegistration',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    freezeTableName: true,
    timestamps: false,
  }
);

// ** Sync Admin Table with Database ** //
await sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('Admin table created successfully');
  })
  .catch((err: Error) => {
    console.error('Error creating Admin table:', err);
  });

export default Admin;
