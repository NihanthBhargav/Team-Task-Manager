const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getAllTasks);
router.get('/project/:projectId', auth, taskController.getTasksByProject);
router.get('/user/:userId', auth, taskController.getTasksByUser);
router.get('/overdue/list', auth, taskController.getOverdueTasks);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
