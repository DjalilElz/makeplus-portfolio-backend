const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Stats = sequelize.define('Stats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // International Congress
    internationalCongressValue: {
      type: DataTypes.INTEGER,
      defaultValue: 11,
      field: 'international_congress_value'
    },
    internationalCongressLabelFr: {
      type: DataTypes.STRING(100),
      defaultValue: 'Congrés Internationale',
      field: 'international_congress_label_fr'
    },
    internationalCongressLabelEn: {
      type: DataTypes.STRING(100),
      defaultValue: 'International Congress',
      field: 'international_congress_label_en'
    },
    // Symposium
    symposiumValue: {
      type: DataTypes.INTEGER,
      defaultValue: 24,
      field: 'symposium_value'
    },
    symposiumLabelFr: {
      type: DataTypes.STRING(100),
      defaultValue: 'Symposium',
      field: 'symposium_label_fr'
    },
    symposiumLabelEn: {
      type: DataTypes.STRING(100),
      defaultValue: 'Symposium',
      field: 'symposium_label_en'
    },
    // Satisfied Companies
    satisfiedCompaniesValue: {
      type: DataTypes.INTEGER,
      defaultValue: 28,
      field: 'satisfied_companies_value'
    },
    satisfiedCompaniesLabelFr: {
      type: DataTypes.STRING(100),
      defaultValue: 'Societé satisfait',
      field: 'satisfied_companies_label_fr'
    },
    satisfiedCompaniesLabelEn: {
      type: DataTypes.STRING(100),
      defaultValue: 'Satisfied Companies',
      field: 'satisfied_companies_label_en'
    },
    // Metadata
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'updated_by',
      references: {
        model: 'admins',
        key: 'id'
      }
    }
  }, {
    tableName: 'stats',
    underscored: true,
    timestamps: true,
    createdAt: false, // Stats table doesn't need created_at
    updatedAt: 'updated_at'
  });

  // Helper method to format stats for API response
  Stats.prototype.toAPIFormat = function() {
    return {
      internationalCongress: {
        value: this.internationalCongressValue,
        labelFr: this.internationalCongressLabelFr,
        labelEn: this.internationalCongressLabelEn
      },
      symposium: {
        value: this.symposiumValue,
        labelFr: this.symposiumLabelFr,
        labelEn: this.symposiumLabelEn
      },
      satisfiedCompanies: {
        value: this.satisfiedCompaniesValue,
        labelFr: this.satisfiedCompaniesLabelFr,
        labelEn: this.satisfiedCompaniesLabelEn
      }
    };
  };

  return Stats;
};
