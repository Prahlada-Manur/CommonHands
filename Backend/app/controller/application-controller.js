const Task = require('../model/task-Schema');
const Application = require('../model/application-Schema');
const { application } = require('express');
const mongoose = require('mongoose')
const { updateStatusValidation, logHoursValidation } = require('../validations/application-Validation');


const applicationCltr = {};

//--------------------------------------API for the user to Apply----------------------------------------------------------------
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
        if (task.volunteersNeeded && task.volunteersNeeded > 0) {
            const volunteerCount = await Application.countDocuments({
                task: id,
                completionStatus: { $in: ['Approved', 'hoursPending', 'Completed'] }
            });
            if (volunteerCount >= task.volunteersNeeded) {
                const rejectedApp = new Application({
                    applicant: req.userId,
                    task: id,
                    ngo: task.ngo,
                    completionStatus: 'Rejected',
                    rejectionReason: 'Volunteer slots are full'
                });

                await rejectedApp.save();
                return res.status(400).json({
                    message: 'Volunteer limit reached. Application automatically rejected.',
                    application: rejectedApp
                });
            }
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
//-------------------------------------API for getting the application-----------------------------------------------------------
applicationCltr.getUserApplication = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.userId }).populate('applicant', ['firstName', 'lastName', 'email'])
            .populate('ngo', ['ngoName', 'contactEmail'])
            .populate('task', ['title', 'description', 'deadline', 'taskType', 'taskStatus'])
        if (!applications || application.length === 0) {
            return res.status(404).json({ error: "Application not Found" })
        }
        res.status(200).json({ message: "Your Applications", total: applications.length, applications })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" })

    }
}
//-------------------------------------API for grtting the information for task and application for ngo----------------------------------------
applicationCltr.InfoByNgo = async (req, res) => {
    try {
        const { status, page = 1, limit = 5, q } = req.query;
        const skip = (Number(page) - 1) * Number(limit)
        const search = { ngo: req.ngoId };
        if (status && status !== 'All') {
            search.completionStatus = status;
        }
        let applications = await Application.find(search).populate('task', ['title', 'requiredHours', 'volunteersNeeded', 'deadline', 'location', 'taskStatus'])
            .populate('applicant', ['firstName', 'lastName', 'email']).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        if (q) {
            const regex = new RegExp(q, 'i');
            applications = applications.filter(app =>
                regex.test(app.applicant?.firstName) ||
                regex.test(app.applicant?.lastName) ||
                regex.test(app.task?.title)
            );
        }
        const total = await Application.countDocuments(search)
        res.status(200).json({ message: 'Task and Application Details', total, currentPage: Number(page), totalPages: Math.ceil(total / Number(limit)), applications })



    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server Error" })

    }
}
//-------------------------------------Api to update the status------------------------------------------------------------------------------
applicationCltr.updateStatus = async (req, res) => {
    const id = req.params.id;
    const body = req.body
    try {
        const { error, value } = updateStatusValidation.validate(body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ error: error.message })
        }
        const application = await Application.findById(id).populate('task', ['title', 'location', 'deadline', 'volunteersNeeded', 'hoursRequired'])
        if (!application) {
            return res.status(404).json({ error: 'Application Not found' })
        }
        if (String(application.ngo) !== String(req.ngoId)) {
            return res.status(400).json({ error: "Unauthorized not related to your ngo" })
        }
        if (value.status === 'Approved') {
            const currentCount = await Application.countDocuments({
                task: application.task._id,
                completionStatus: { $in: ['Approved', 'hoursPending', 'Completed'] }
            });
            if (currentCount >= application.task.volunteersNeeded) {
                return res.status(400).json({ error: 'Volunteer slots already full. Cannot approve more.' });
            }
        }
        application.completionStatus = value.status;
        application.rejectionReason = value.status === 'Rejected' ? value.rejectionReason || 'Rejected by NGO' : null;
        if (value.status === 'Completed') {
            application.completionDate = new Date();
        }
        await application.save();
        res.status(200).json({
            message: `Application status updated to ${value.status}`, application: {
                _id: application._id,
                status: application.completionStatus,
                rejectionReason: application.rejectionReason,
                completionDate: application.completionDate,
                applicant: application.applicant,
                task: application.task
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//-----------------------------------APi or logging the hours by user----------------------------------------------------------------------
applicationCltr.logHours = async (req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        const { error, value } = logHoursValidation.validate(body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const application = await Application.findById(id).populate('task', ['title', 'location', 'deadline', 'volunteersNeeded', 'requiredHours', 'hoursLogged'])
        if (!application) {
            return res.status(404).json({ error: "Application not found" })
        }
        if (String(application.applicant) !== String(req.userId)) {
            return res.status(403).json({ error: "Not authorized to log hours" })
        }
        if (['Rejected', 'Completed'].includes(application.completionStatus)) {
            return req.status(400).json({ error: "Cannot log hours for Completed or Rejected application" })
        }
        const log = {
            hours: value.hours,
            note: value.note || null,
            status: 'Pending',
            date: new Date()
        }
        application.hoursLog.push(log);
        application.hoursRequested += value.hours;
        application.completionStatus = 'hoursPending'
        await application.save();
        const populateData = await Application.findById(application._id).populate('applicant', ['firstName', 'lastName', 'email'])
            .populate('task', ['title', 'requiredHours', 'volunteersNeeded', 'deadline'])
        res.status(200).json({ message: "Logged hours for review successfully", application: populateData })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//------------------------------------API for updating the log hours on rejection or on submitting--------------------------------------
applicationCltr.updatelogHours = async (req, res) => {
    const { id, logId } = req.params
    const body = req.body
    try {
        const { error, value } = logHoursValidation.validate(body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ error: error.message })
        }
        const application = await Application.findById(id).populate('task', ['title', 'location', 'deadline', 'volunteersNeeded', 'requiredHours', 'hoursLogged'])
        if (!application) {
            return res.status(404).json({ error: "Application not found" })
        }
        if (String(application.applicant) !== String(req.userId)) {
            return res.status(403).json({ error: "Not authorized to log hours" })
        }
        if (['Rejected', 'Completed'].includes(application.completionStatus)) {
            return req.status(400).json({ error: "Cannot log hours for Completed or Rejected application" })
        }
        const log = application.hoursLog.id(logId)
        if (!log) {
            return res.status(404).json({ error: 'application log not found' })
        }
        if (!['Pending', 'Rejected'].includes(log.status)) {
            return res.status(400).json({ error: 'Only pending or rejected logs can be updated' });
        }
        log.hours = value.hours;
        log.note = value.note || log.note;
        log.status = 'Pending';
        log.date = new Date();
        await application.save();
        res.status(200).json({ message: 'Updated the log hours Successfully', updatedLog: log })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//--------------------------------------API to get all the pending log approval---------------------------------------------------------------
applicationCltr.getPendingLogs = async (req, res) => {
    try {
        const { status = 'Pending', page = 1, limit = 5, taskId } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const filter = { ngo: req.ngoId };
        if (taskId) {
            filter.task = new mongoose.Types.ObjectId(taskId);
        }

        const applications = await Application.find(filter)
            .populate('applicant', ['firstName', 'lastName', 'email'])
            .populate('task', ['title', ' requiredHours', 'volunteersNeeded', 'deadline'])
            .sort({ createdAt: -1 });

        const logs = applications.flatMap(app =>
            app.hoursLog
                .filter(log => log.status === status)
                .map(ele => ({
                    applicationId: app._id,
                    logId: ele._id,
                    volunteer: app.applicant,
                    task: app.task,
                    hours: ele.hours,
                    note: ele.note,
                    status: ele.status,
                    date: ele.date
                }))
        );

        const paginated = logs.slice(skip, skip + Number(limit));

        res.status(200).json({
            message: `Fetched ${status} logs for NGO`,
            total: logs.length,
            currentPage: Number(page),
            totalPages: Math.ceil(logs.length / Number(limit)),
            logs: paginated
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}
//---------------------------------------API to update the the log status and strore it in the model-----------------------------------------
applicationCltr.updateLogStatus = async (req, res) => {
    const { appId, logId } = req.params;
    const body = req.body;
    try {
        if (!['Approved', 'Rejected'].includes(body.status)) {
            return res.status(400).json({ error: 'The status must be Approved or Rejected in the same format' })
        }
        const application = await Application.findById(appId)
        if (!application) {
            return res.status(404).json({ error: 'Application not found' })
        }
        const log = application.hoursLog.id(logId)
        if (!log) {
            return res.status(404).json({ error: "Log hours not found" })
        }
        if (log.status !== 'Pending') {
            return res.status(400).json({ error: "Already requested for Verification" })
        }
        log.status = body.status
        if (body.status === 'Approved') {
            application.hoursLogged += log.hours

            const task = await Task.findById(application.task)
            application.completionStatus = task && application.hoursLogged >= task.requiredHours ? "Completed" : "hoursPending"
            if (application.completionStatus === 'Completed') {
                application.completionDate = new Date()
            }
        }
        await application.save()
        res.status(200).json({
            message: `log ${body.status} successfully`,
            applicationId: appId,
            logId,
            updatedStatus: log.status,
            totalHoursLogged: application.hoursLogged,
            completionDate: application.completionDate
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' })

    }
}
//------------------------------------------API to get application by id-----------------------------------------------------------------------
applicationCltr.getApplicationById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Application ID not provided" });
        }

        const application = await Application.findById(id)
            .populate('applicant', ['firstName', 'lastName', 'email'])
            .populate('ngo', ['ngoName', 'contactEmail'])
            .populate('task', ['title', 'description', 'deadline', 'location', 'taskType', 'taskStatus']);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        if (String(application.applicant._id) !== String(req.userId) && req.role !== 'Admin') {
            return res.status(403).json({ error: "You are not authorized to view this application" });
        }

        const formattedApplication = {
            _id: application._id,
            completionStatus: application.completionStatus,
            hoursLogged: application.hoursLogged,
            hoursRequested: application.hoursRequested,
            rejectionReason: application.rejectionReason,
            completionDate: application.completionDate,
            certificateUrl: application.certificateUrl,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            applicant: application.applicant,
            ngo: application.ngo,
            task: application.task,
            hoursLog: application.hoursLog.map(log => ({
                hours: log.hours,
                status: log.status,
                note: log.note,
                date: log.date
            }))
        };
        res.status(200).json({
            message: "Application details retrieved successfully",
            application: formattedApplication
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
//---------------------------------------Api for admin to list all the applications--------------------------------------------------
applicationCltr.adminGetApplications = async (req, res) => {
    const { status, q, page = 1, limit = 5 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};

    if (status && status !== "All") {
        filter.completionStatus = status;
    }
    try {
        const applications = await Application.find(filter)
            .populate("applicant", ["firstName", "lastName", "email"])
            .populate("ngo", ["ngoName", "contactEmail"])
            .populate("task", ["title", "taskType", "deadline", "location"])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        if (!applications || applications.length === 0) {
            return res.status(400).json({ error: "No application found" });
        }

        const total = await Application.countDocuments(filter);

        res.status(200).json({
            message: "List of all applications",
            total,
            currentPage: Number(page), limit: Number(limit),
            totalPage: Math.ceil(total / limit),
            applications,

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
//------------------------------------------APi to delete the application------------------------------------------------------------
applicationCltr.delete = async (req, res) => {
    const id = req.params.id
    try {
        const deleteApplication = await Application.findByIdAndDelete(id)
        if (!deleteApplication) {
            return res.status(404).json({ error: "Application not found" })
        }
        res.status(200).json({message:"Deleted application",deletedId:id})
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })

    }
}

module.exports = applicationCltr    