import bcrypt from 'bcrypt';
import { DataTypes, Model, Optional } from 'sequelize';
import { generateAvatarUrl } from '../../../utils/avatar.js';
import { sequelizeConInstance } from '../../sequelizeCon.js';
import Admin from './admin.model.js';

interface AdminRegistrationAttributes {
  id: number;
  new_admin: string;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}

interface AdminRegistrationCreationAttributes
  extends Optional<AdminRegistrationAttributes, 'id'> {}

const sequelize = sequelizeConInstance();

class AdminRegistration
  extends Model<
    AdminRegistrationAttributes,
    AdminRegistrationCreationAttributes
  >
  implements AdminRegistrationAttributes
{
  declare id: number;
  declare new_admin: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare created_at: Date;

  // ** Declare the static method loginAdmin and check Role ** //
  static async loginAdmin(
    email: string,
    password: string
  ): Promise<AdminRegistration | null> {
    return await this.findOne({ where: { email: email, password: password } });
  }

  // ** Declare the static method logout admin ** //
  static async logoutAdmin(email: string): Promise<AdminRegistration | null> {
    try {
      return await this.findOne({ where: { email: email } });
    } catch (error) {
      console.error('Error logging out admin:', error);
      throw new Error('Error logging out admin');
    }
  }
}

AdminRegistration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    new_admin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: async (value: string) => {
          const admin = await AdminRegistration.findOne({
            where: { username: value },
          });
          if (admin) {
            throw new Error('Username already in use');
          }
        },
        is: /^[a-zA-Z0-9_]*$/,
        len: [3, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        isUnique: async (value: string) => {
          const admin = await AdminRegistration.findOne({
            where: { email: value },
          });
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    tableName: 'AdminRegistration',
    timestamps: false,
    freezeTableName: true,
  }
);

// ** Hash the password before creating a new admin ** //
AdminRegistration.beforeCreate(async (admin: AdminRegistration) => {
  try {
    if (admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      admin.password = hashedPassword;
    }
  } catch (error) {
    console.error('Error hashing password', error);
    throw new Error('Error hashing password');
  }
});

AdminRegistration.afterCreate(
  async (admin: AdminRegistration & { new_admin: string }) => {
    try {
      if (admin) {
        const spaceIndex = admin.new_admin.indexOf(' ');
        const firstName =
          spaceIndex !== -1
            ? admin.new_admin.slice(0, spaceIndex)
            : admin.new_admin;
        const lastName =
          spaceIndex !== -1 ? admin.new_admin.slice(spaceIndex + 1) : '';
        const avatar = generateAvatarUrl(firstName, lastName);

        await Admin.upsert({
          firstName: firstName,
          lastName: lastName,
          username: admin.username,
          email: admin.email,
          password: admin.password,
          reset_password_token: '',
          reset_password_expires: new Date(),
          last_login: new Date(),
          role: 'admin',
          avatarUrl: avatar,
          profilePic: avatar,
          admin_registrationid: admin.id,
          created_at: new Date(),
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }
);

// ** Declare the static method loginAdmin and check Role ** //
AdminRegistration.loginAdmin = async function (
  email: string,
  password: string
): Promise<AdminRegistration | null> {
  try {
    const admin = await AdminRegistration.findOne({
      where: { email: email, password: password },
    });
    if (admin) {
      const authenticate = await bcrypt.compare(password, admin.password);
      if (authenticate) {
        return admin;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error logging in admin:', error);
    throw new Error('Error logging in admin');
  }
};

// ** Declare the static method logout admin ** //
AdminRegistration.logoutAdmin = async function (
  email: string
): Promise<AdminRegistration | null> {
  try {
    return await AdminRegistration.findOne({ where: { email: email } });
  } catch (error) {
    console.error('Error logging out admin:', error);
    throw new Error('Error logging out admin');
  }
};

// Sync AdminRegistration model with database table ** //
await sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('AdminRegistration table created successfully');
  })
  .catch((err: Error) => {
    console.error('Error creating AdminRegistration table:', err);
  });

export default AdminRegistration;
