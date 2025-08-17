const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Production - use Render's PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Development - use local PostgreSQL or SQLite
  const databaseUrl = process.env.DATABASE_URL || 'sqlite:./dev.sqlite';
  
  if (databaseUrl.startsWith('postgres')) {
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false
    });
  } else {
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'sqlite',
      storage: './dev.sqlite',
      logging: false
    });
  }
}

module.exports = sequelize;
