const Task = require('../model/task-Schema')
const OrganizationProfile = require('../model/organizationProfile-Schema')
const { createTaskValidation, updateTaskValidation } = require('../validations/tasks-Validation');

const taskCltr = {};

//--------------------------------API to create Tasks-----------------------------------------------------
taskCltr.createTask = async (req, res) => {

    const body = req.body
    try {
        const { error, value } = createTaskValidation.validate(body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ error: error.message })
        }
        const ngo = await OrganizationProfile.findById(req.ngoId)
        if (!ngo) {
            return res.status(404).json({ error: "NGO not Found" })
        }
        if (ngo.status !== "Verified") {
            return res.status(403).json({ error: "NGO is not verified!,Please wait for admin approval" })
        }
        const type = value.taskType.toLowerCase() === 'volunteer' ? 'Volunteer' : 'funding';
        const task = new Task({ ...value, taskType: type, ngo: req.ngoId, taskStatus: 'Open', createdBy: req.userId, fundingGoal: type === 'funding' ? Number(value.fundingGoal || 0) : 0 })
        await task.save()

        res.status(201).json({ message: 'Task created successfully', task })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//---------------------------------API to get all the task posted by one ngo--------------------------------
taskCltr.getTaskByNgo = async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query
        const skip = (Number(page) - 1) * Number(limit)
        const tasks = await Task.find({ ngo: req.ngoId }).sort({ createdAt: -1 }).skip(skip)
            .limit(Number(limit))
            .populate('ngo', ['ngoName', 'contactEmail'])
            .populate('createdBy', ['email', 'firstName', 'lastName'])
        const total = await Task.countDocuments({ ngo: req.ngoId })
        res.status(200).json({
            message: "Tasks list by NGO", total,
            currentPage: Number(page), limit: Number(limit), totalPage: Math.ceil(total / limit), tasks
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' })

    }
}
//---------------------------------API to get all the task and also search,sort,filter,pagination------------------
taskCltr.getAllTask = async (req, res) => {
    try {
        const { type, q, page = 1, limit = 5 } = req.query
        const skip = (Number(page) - 1) * Number(limit)
        const searchType = { taskStatus: 'Open' }
        if (type) {
            const Type = type.toLowerCase();
            searchType.taskType = Type === 'volunteer' ? 'Volunteer' : 'funding';
        }
        if (q) {
            const regex = new RegExp(q, 'i')
            searchType.$or = [{ title: regex }, { description: regex }]
        }
        const tasks = await Task.find(searchType).sort({ createdAt: -1 }).skip(skip)
            .limit(Number(limit)).populate('ngo', ['ngoName', 'contactEmail']).populate('createdBy', ['email', 'firstName'])
        const total = await Task.countDocuments(searchType);
        res.status(200).json({
            message: "Open Tasks List", total,
            currentPage: Number(page), limit: Number(limit),
            totalPage: Math.ceil(total / limit), tasks
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//--------------------------------API to get task by id-------------------------------------------------------------
taskCltr.getTaskbyId = async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findById(id).populate('ngo', ['ngoName', 'contactEmail']).populate('createdBy', ['firstName', 'lastName', 'email'])
        if (!task) {
            return res.status(404).json({ error: 'Task not Found' })
        }
        res.status(200).json({ message: "The task you asked for", task })
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' })
    }
}
//----------------------------------------API to update the task--------------------------------------------------
taskCltr.updateTask = async (req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        const { error, value } = updateTaskValidation.validate(body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ error: error.message })
        }
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json({ error: "Task not found" })

        }
        if (String(task.ngo) !== String(req.ngoId)) {
            return res.status(401).json({ error: "You are not authorized to updated the data" })
        }
        if (task.taskType !== 'funding' && 'fundingGoal' in value) {
            return res.status(400).json({ error: "Cant updated funding goal for non funding tasks" })
        }
        const updateTask = await Task.findByIdAndUpdate(id, value, { new: true, runValidators: true })
        if (!updateTask) {
            return res.status(400).json({ error: " Can update only title,description,location,requiredSkills,requiredHours,fundingGoal,deadline" })
        }
        res.status(200).json({ message: "Task updated successfully", updateTask })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
}
//--------------------------API for deleting the tasks------------------------------------------------------
taskCltr.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json({ error: 'task not found' })
        }
        if (req.role !== 'Admin' && String(task.ngo) !== String(req.ngoId)) {
            return res.status(401).json({ error: "You are not authorized to delelte" })
        }
        const deleteTask = await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'Successfully deleted a task', deleteTask })
    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
    }
}
taskCltr.getAdminTasks = async (req, res) => {
    try {
        const { type, q, page = 1, limit = 5, status } = req.query
        let searchType = {}
        const skip = (Number(page) - 1) * Number(limit)
        if (status) {
            searchType = { taskStatus: status }
        }
        if (type) {
            const Type = type.toLowerCase();
            searchType.taskType = Type === 'volunteer' ? 'Volunteer' : 'funding';
        }
        if (q) {
            const regex = new RegExp(q, 'i')
            searchType.$or = [{ title: regex }, { description: regex }]
        }
        const tasks = await Task.find(searchType).sort({ createdAt: -1 }).skip(skip)
            .limit(Number(limit)).populate('ngo', ['ngoName', 'contactEmail'])
            .populate('createdBy', ['email', 'firstName'])
        const total = await Task.countDocuments(searchType);
        res.status(200).json({
            message: "Open Tasks List", total,
            currentPage: Number(page), limit: Number(limit),
            totalPage: Math.ceil(total / limit), tasks
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}




//--------------------------------------------------------------------------------------------------------------------
module.exports = taskCltr
