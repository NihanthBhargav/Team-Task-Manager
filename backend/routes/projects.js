const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getAllProjects);
router.get('/:id', auth, projectController.getProjectById);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/:id/members', auth, projectController.addMember);
router.post('/:id/members/remove', auth, projectController.removeMember);

module.exports = router;
