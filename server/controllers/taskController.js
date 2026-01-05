import Task from '../models/Task.js';

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'Pending',
      dueDate,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    // Find task and verify ownership
    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate && { dueDate }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find task and verify ownership
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

