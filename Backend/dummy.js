// app/controller/task-Controller.js
const Task = require('../model/task-Schema');
const OrganizationProfile = require('../model/organizationProfile-Schema');
const { createTaskSchema, updateTaskSchema } = require('../validations/task-validation');

const taskCltr = {};

// Create Task (NGO only) with Joi validation
taskCltr.createTask = async (req, res) => {
  try {
    if (!req.ngoId) return res.status(403).json({ error: 'NGO profile not found in token' });

    // Validate body
    const { error, value } = createTaskSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: error.details });

    // Normalize taskType
    const type = String(value.taskType).toLowerCase() === 'volunteer' ? 'Volunteer' : 'funding';

    const payload = {
      ngo: req.ngoId,
      title: value.title,
      description: value.description,
      location: value.location,
      taskType: type,
      requiredSkills: value.requiredSkills || null,
      requiredHours: value.requiredHours || null,
      fundingGoal: type === 'funding' ? Number(value.fundingGoal || 0) : 0,
      deadline: new Date(value.deadline),
      currentFund: 0,
      taskStatus: 'Open'
    };

    const task = new Task(payload);
    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all open tasks (public) - unchanged except optional admin filter
taskCltr.getAllTasks = async (req, res) => {
  try {
    const { type, q, page = 1, limit = 20 } = req.query;
    const filters = { taskStatus: 'Open' };

    if (type) {
      const t = String(type).toLowerCase();
      if (t === 'volunteer') filters.taskType = 'Volunteer';
      else if (t === 'funding' || t === 'donation' || t === 'fund') filters.taskType = 'funding';
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filters.$or = [{ title: regex }, { description: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('ngo', 'ngoName');

    const total = await Task.countDocuments(filters);
    res.status(200).json({ total, page: Number(page), limit: Number(limit), tasks });
  } catch (err) {
    console.error('getAllTasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get tasks for logged-in NGO (NGO only)
taskCltr.getTasksByNgo = async (req, res) => {
  try {
    if (!req.ngoId) return res.status(403).json({ error: 'NGO profile not found in token' });
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find({ ngo: req.ngoId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments({ ngo: req.ngoId });
    res.status(200).json({ total, page: Number(page), limit: Number(limit), tasks });
  } catch (err) {
    console.error('getTasksByNgo error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single Task by id
taskCltr.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('ngo', 'ngoName contactEmail');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    console.error('getTaskById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Task (NGO only) with Joi validation
taskCltr.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!req.ngoId || task.ngo.toString() !== req.ngoId.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this task' });
    }

    // Validate updates
    const { error, value } = updateTaskSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: error.details });

    const allowed = ['title', 'description', 'location', 'requiredSkills', 'requiredHours', 'fundingGoal', 'deadline', 'isFeatured', 'featuredUntil', 'taskStatus'];
    const updates = {};
    allowed.forEach((field) => {
      if (field in value) updates[field] = value[field];
    });

    const updated = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.status(200).json({ message: 'Task updated', task: updated });
  } catch (err) {
    console.error('updateTask error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Task (NGO only)
taskCltr.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!req.ngoId || task.ngo.toString() !== req.ngoId.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this task' });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: Get all tasks (any status/type) - Admin only
taskCltr.adminGetAllTasks = async (req, res) => {
  try {
    const { q, page = 1, limit = 50, status, type } = req.query;
    const filters = {};

    if (status) filters.taskStatus = status;
    if (type) {
      const t = String(type).toLowerCase();
      if (t === 'volunteer') filters.taskType = 'Volunteer';
      else if (t === 'funding' || t === 'donation' || t === 'fund') filters.taskType = 'funding';
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filters.$or = [{ title: regex }, { description: regex }, { 'ngo.ngoName': regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // populate ngo details for admin
    const tasks = await Task.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('ngo', 'ngoName regNumber contactEmail');

    const total = await Task.countDocuments(filters);
    res.status(200).json({ total, page: Number(page), limit: Number(limit), tasks });
  } catch (err) {
    console.error('adminGetAllTasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = taskCltr;
