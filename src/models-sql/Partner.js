const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Partner = sequelize.define('Partner', {
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
          args: [1, 100],
          msg: 'Name must be between 1 and 100 characters'
        }
      }
    },
    logo: {
      type: DataTypes.TEXT('long'), // LONGTEXT for MySQL
      allowNull: false // Base64 encoded image
    },
    logoMimeType: {
      type: DataTypes.STRING(50),
      defaultValue: 'image/png',
      field: 'logo_mime_type'
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Please provide a valid URL'
        }
      }
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'partners',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['display_order'] },
      { fields: ['is_active'] }
    ]
  });

  return Partner;
};
