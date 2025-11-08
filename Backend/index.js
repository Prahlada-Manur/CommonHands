const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3070
const app = express();
app.use(express.json())
app.use(cors())
//-------------------------------------------------------------------------------------------------
const configDb = require('./config/configDb')
configDb()
//------------------------------------------------File Imports-------------------------------------------------
const authenticateUser = require('./app/middleware/authenticateUser')
const authorizeUser = require('./app/middleware/authorizeUser')
const upload = require('./app/middleware/uploadCloudinary');
const ngoCltr = require('./app/controller/ngo-Controller');
const userCltr = require('./app/controller/user-Controller')
const taskCltr = require('./app/controller/task-Controller')
const applicationCltr = require('./app/controller/application-controller')

//----------------------------------------------------------------------------------------------------------
//----------------------------------------API Endpoints for user---------------------------------------------
app.post('/api/register', userCltr.register);
app.post('/api/login', userCltr.login);
app.get('/api/profile', authenticateUser, authorizeUser(['Contributor', 'Admin']), userCltr.show);
app.put('/api/user/update/', authenticateUser, authorizeUser(['Contributor']), userCltr.updateUser)
app.delete('/api/user/delete/:id', authenticateUser, authorizeUser(['Contributor', 'Admin']), userCltr.delete)
app.get('/api/user/list', authenticateUser, authorizeUser(['Admin']), userCltr.list)
//----------------------------------------------------------------------------------------------------------
//----------------------------------------API Endpoints for NGO----------------------------------------------
app.post('/api/ngo/register', ngoCltr.register)
app.post('/api/ngo/upload-documents', authenticateUser, authorizeUser(["NGO"]), upload, ngoCltr.uploadDoc);
app.put('/api/ngo/verify/:id', authenticateUser, authorizeUser(['Admin']), ngoCltr.VerifyNgo);
app.get('/api/ngo/profile', authenticateUser, authorizeUser(['NGO', "Admin"]), ngoCltr.ngoProfile);
app.put('/api/ngo/update', authenticateUser, authorizeUser(['NGO']), upload, ngoCltr.updateNgo)
app.delete('/api/ngo/delete', authenticateUser, authorizeUser(['NGO']), ngoCltr.delete)
app.get('/api/ngo/list', authenticateUser, authorizeUser(['Admin']), ngoCltr.list)
app.delete('/api/ngo/admin/:id', authenticateUser, authorizeUser(['Admin']), ngoCltr.deleteByAdmin)
//-------------------------------------------------------------------------------------------------
//--------------------------------------API Endpoints for Task-------------------------------------
app.post('/api/task', authenticateUser, authorizeUser(['NGO']), upload, taskCltr.createTask)
app.get('/api/ngo/tasks', authenticateUser, authorizeUser(['NGO']), taskCltr.getTaskByNgo)
app.get('/api/tasks', taskCltr.getAllTask)
app.get('/api/task/:id', taskCltr.getTaskbyId)
app.put('/api/task/:id', authenticateUser, authorizeUser(['NGO']), upload, taskCltr.updateTask)
app.delete('/api/task/:id', authenticateUser, authorizeUser(["Admin", 'NGO']), taskCltr.delete)
app.get('/api/admin/tasks', authenticateUser, authorizeUser(['Admin']), taskCltr.getAdminTasks)
app.get('/api/tasks/dashboard', authenticateUser, authorizeUser(["NGO"]), taskCltr.overview)
//------------------------------------------------------------------------------------------------
//---------------------------------------API for Aplication controller-------------------------------
app.post('/api/task/apply/:id', authenticateUser, applicationCltr.apply)
app.get('/api/user/applications', authenticateUser, authorizeUser(['Contributor']), applicationCltr.getUserApplication)
app.get('/api/ngo/application', authenticateUser, authorizeUser(['NGO']), applicationCltr.InfoByNgo)
app.put('/api/application/status/:id', authenticateUser, authorizeUser(['NGO']), applicationCltr.updateStatus)
app.post('/api/application/log/:id', authenticateUser, authorizeUser(['Contributor']), applicationCltr.logHours)
app.put('/api/application/:id/log/:logId', authenticateUser, authorizeUser(['Contributor']), applicationCltr.updatelogHours)
app.get('/api/ngo/logs', authenticateUser, authorizeUser(['NGO']), applicationCltr.getPendingLogs)
//----------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
