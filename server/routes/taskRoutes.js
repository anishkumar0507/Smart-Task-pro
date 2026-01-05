import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validateTask, validateTaskUpdate } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .put(validateTaskUpdate, updateTask)
  .delete(deleteTask);

export default router;

