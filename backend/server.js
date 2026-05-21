require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Model associations
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Project.belongsToMany(User, { through: 'ProjectMembers', as: 'members' });
Project.hasMany(Task, { foreignKey: 'projectId' });
User.belongsToMany(Project, { through: 'ProjectMembers' });

Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assigned' });
Task.belongsTo(Project, { foreignKey: 'projectId' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Database sync - use alter: true to preserve data, not destroy it
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully');
}).catch(err => console.error('Database sync error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
