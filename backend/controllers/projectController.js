const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.userId,
    });

    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    let projects;
    if (req.userRole === 'admin') {
      projects = await Project.findAll({
        attributes: ['id', 'title', 'description', 'createdBy', 'createdAt'],
        include: [
          { 
            model: User, 
            as: 'members',
            attributes: ['id', 'name', 'email'],
            through: { attributes: [] },
            required: false
          },
        ],
        raw: false,
        limit: 100,
      });
    } else {
      projects = await Project.findAll({
        attributes: ['id', 'title', 'description', 'createdBy', 'createdAt'],
        include: [
          {
            model: User,
            as: 'members',
            where: { id: req.userId },
            attributes: ['id', 'name', 'email'],
            through: { attributes: [] },
            required: true,
          },
        ],
        raw: false,
      });
    }
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      attributes: ['id', 'title', 'description', 'createdBy', 'createdAt', 'updatedAt'],
      include: [
        { 
          model: User, 
          as: 'members', 
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
          required: false
        },
        { 
          model: Task,
          attributes: ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'assignedTo', 'createdBy'],
          include: [
            { model: User, as: 'assigned', attributes: ['id', 'name', 'email'] }
          ]
        },
        { 
          model: User, 
          as: 'creator', 
          attributes: ['id', 'name', 'email'] 
        },
      ],
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project details', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.createdBy !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    project.title = title;
    project.description = description;
    await project.save();
    res.json({ message: 'Project updated', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.createdBy !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.addMember(userId);
    res.json({ message: 'Member added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.removeMember(userId);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
