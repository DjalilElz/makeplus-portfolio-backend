const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: 'Name must be between 2 and 100 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email'
        }
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: {
          args: [5, 200],
          msg: 'Subject must be between 5 and 200 characters'
        }
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [10, 2000],
          msg: 'Message must be between 10 and 2000 characters'
        }
      }
    },
    language: {
      type: DataTypes.ENUM('fr', 'en'),
      defaultValue: 'fr'
    },
    status: {
      type: DataTypes.ENUM('new', 'read', 'replied', 'archived'),
      defaultValue: 'new'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address'
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent'
    },
    emailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_sent'
    },
    emailSentAt: {
      type: DataTypes.DATE,
      field: 'email_sent_at'
    }
  }, {
    tableName: 'contacts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['email'] },
      { fields: ['status'] },
      { fields: [{ attribute: 'created_at', order: 'DESC' }] },
      { fields: ['language'] }
    ]
  });

  return Contact;
};
