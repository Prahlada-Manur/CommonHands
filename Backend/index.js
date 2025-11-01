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
const userCltr = require('./app/controller/user-Controller')
const ngoCLtr = require('./app/controller/ngo-Controller')
const authenticateUser = require('./app/middleware/authenticateUser')
const authorizeUser = require('./app/middleware/authorizeUser')
const upload = require('./app/middleware/uploadCloudinary');
const ngoCltr = require('./app/controller/ngo-Controller');

//----------------------------------------------------------------------------------------------------------
//----------------------------------------API Endpoints for user---------------------------------------------
app.post('/api/register', upload, userCltr.register);
app.post('/api/login', userCltr.login);
app.get('/api/profile', authenticateUser, authorizeUser(['Contributor', 'Admin']), userCltr.show);
app.put('/api/user/update/:id', authenticateUser, authorizeUser(['Contributor']), userCltr.updateUser)
app.delete('/api/user/delete/:id', authenticateUser, authorizeUser(['Contributor', 'Admin']), userCltr.delete)
app.get('/api/user/list', authenticateUser, authorizeUser(['Admin']), userCltr.list)
//----------------------------------------------------------------------------------------------------------
//----------------------------------------API Endpoints for NGO----------------------------------------------
app.post('/api/ngo/register', ngoCLtr.register)
app.post('/api/ngo/upload-documents', authenticateUser, authorizeUser(["NGO"]), upload, ngoCLtr.uploadDoc);
app.put('/api/ngo/verify/:id', authenticateUser, authorizeUser(['Admin']), ngoCLtr.VerifyNgo);
app.get('/api/ngo/profile/', authenticateUser, authorizeUser(['NGO', "Admin"]), ngoCLtr.ngoProfile);
app.put('/api/ngo/update/:id', authenticateUser, authorizeUser(['NGO']), ngoCLtr.updateNgo)
app.delete('/api/ngo/delete/:id', authenticateUser, authorizeUser(['Admin', 'NGO']), ngoCltr.delete)
app.get('/api/ngo/list', authenticateUser, authorizeUser(['Admin']), ngoCltr.list)
//-------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
