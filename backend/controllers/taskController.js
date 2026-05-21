const Task = require('../models/Task');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      assignedTo,
      projectId,
      createdBy: req.userId,
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      attributes: ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'assignedTo', 'createdBy'],
      include: [
        { model: 'User', as: 'assigned', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 500
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedTo: req.userId },
      attributes: ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'projectId'],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOverdueTasks = async (req, res) => {
  try {
    const now = new Date();
    const overdue = await Task.findAll({
      where: {
        dueDate: { [Op.lt]: now },
        status: { [Op.ne]: 'done' },
      },
      attributes: ['id', 'title', 'status', 'dueDate', 'projectId'],
      order: [['dueDate', 'ASC']],
      limit: 50
    });
    res.json(overdue);
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.userRole !== 'admin' && task.assignedTo !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.userRole !== 'admin' && task.assignedTo === req.userId) {
      task.status = status;
    } else {
      task.title = title;
      task.description = description;
      task.status = status;
      task.priority = priority;
      task.dueDate = dueDate;
      task.assignedTo = assignedTo;
    }

    await task.save();
    res.json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.userRole !== 'admin' && task.createdBy !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    let tasks;
    if (req.userRole === 'admin') {
      tasks = await Task.findAll();
    } else {
      tasks = await Task.findAll({
        where: { assignedTo: req.userId },
      });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
