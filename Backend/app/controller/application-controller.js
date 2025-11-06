const Task = require('../model/task-Schema');
const Application = require('../model/application-Schema');
const OrganizationProfile = require('../model/organizationProfile-Schema');
const User = require('../model/user-Schema')

const applicationCltr = {};

//--------------------------------------API fro the user to Apply---------------------------------------------------
applicationCltr.apply = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Task id is not provided' })
    }
    try {
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json({ error: "Task not Found" })
        }
        if (String(task.taskType).toLowerCase() !== 'volunteer' || task.taskStatus !== 'Open') {
            return res.status(400).json({ error: 'Can only apply for VLounteer task or the task is closed' })
        }
        const existingApplication = await Application.findOne({ task: id, applicant: req.userId })
        if (existingApplication) {
            return res.status(403).json({ error: 'You have already applied for this task' })
        }
        const application = new Application({
            applicant: req.userId,
            task: id,
            ngo: task.ngo
        })
        await application.save();
        const applicationPopulate = await Application.findById(application._id).populate('applicant', ['firstName', 'lastName', 'email'])
            .populate('ngo', ['ngoName', 'contactEmail'])
            .populate('task', ['title', 'location', 'description', 'deadline'])


        res.status(201).json({ message: "You have applied for the following Task", application: applicationPopulate })
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Internal server Error" })
    }
}
//-------------------------------------API for getting the application 


module.exports = applicationCltr