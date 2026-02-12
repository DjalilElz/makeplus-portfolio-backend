const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Video = sequelize.define('Video', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titleFr: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'title_fr',
      validate: {
        len: {
          args: [1, 200],
          msg: 'French title must be between 1 and 200 characters'
        }
      }
    },
    titleEn: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'title_en',
      validate: {
        len: {
          args: [1, 200],
          msg: 'English title must be between 1 and 200 characters'
        }
      }
    },
    descriptionFr: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description_fr'
    },
    descriptionEn: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description_en'
    },
    youtubeUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'youtube_url'
    },
    youtubeVideoId: {
      type: DataTypes.STRING(50),
      field: 'youtube_video_id'
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON, // For MySQL 8.0+, use TEXT for earlier versions
      defaultValue: []
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
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
      references: {
        model: 'admins',
        key: 'id'
      }
    }
  }, {
    tableName: 'videos',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['display_order'] },
      { fields: ['is_active'] },
      { fields: [{ attribute: 'created_at', order: 'DESC' }] },
      { fields: ['created_by'] }
    ]
  });

  return Video;
};
