const { Sequelize } = require('sequelize');
const path = require('path');

// Import model definitions
const AdminModel = require('./Admin');
const ContactModel = require('./Contact');
const PartnerModel = require('./Partner');
const VideoModel = require('./Video');
const StatsModel = require('./Stats');

// Database configuration from environment variables
const dbConfig = {
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
};

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Initialize models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models
db.Admin = AdminModel(sequelize);
db.Contact = ContactModel(sequelize);
db.Partner = PartnerModel(sequelize);
db.Video = VideoModel(sequelize);
db.Stats = StatsModel(sequelize);

// Define associations
db.Video.belongsTo(db.Admin, { as: 'creator', foreignKey: 'createdBy' });
db.Admin.hasMany(db.Video, { as: 'videos', foreignKey: 'createdBy' });

db.Stats.belongsTo(db.Admin, { as: 'updater', foreignKey: 'updatedBy' });
db.Admin.hasMany(db.Stats, { as: 'statsUpdates', foreignKey: 'updatedBy' });

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ ${dbConfig.dialect.toUpperCase()} Database Connected: ${dbConfig.host}`);
    
    // Sync models in development (careful in production!)
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
      console.log('✅ Database synchronized');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error connecting to ${dbConfig.dialect.toUpperCase()} database:`, error.message);
    throw error;
  }
};

db.connectDB = connectDB;

module.exports = db;
