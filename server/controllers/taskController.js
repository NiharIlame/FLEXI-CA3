const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, subject, priority, status, dueDate } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({ message: 'Title, subject, and due date are required.' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      subject,
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate,
      user: req.user._id,
    });

    return res.status(201).json({ message: 'Task created successfully.', task });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while creating task.', error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching tasks.', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching task.', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const allowedFields = ['title', 'description', 'subject', 'priority', 'status', 'dueDate'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    task.updatedAt = Date.now();
    await task.save();

    return res.status(200).json({ message: 'Task updated successfully.', task });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating task.', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting task.', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.status = status;
    task.updatedAt = Date.now();
    await task.save();

    return res.status(200).json({ message: 'Task status updated successfully.', task });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating task status.', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;
    const overdue = tasks.filter((task) => task.status === 'overdue' || (task.status !== 'completed' && new Date(task.dueDate) < new Date())).length;
    const upcoming = tasks
      .filter((task) => task.status !== 'completed')
      .filter((task) => new Date(task.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const recent = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

    return res.status(200).json({
      totalTasks: total,
      pendingTasks: pending,
      completedTasks: completed,
      overdueTasks: overdue,
      upcomingDeadlines: upcoming,
      recentTasks: recent,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching dashboard statistics.', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getDashboardStats,
};
