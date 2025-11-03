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


//--------------------------------------------------------------------------------------------------------------------
module.exports = taskCltr
