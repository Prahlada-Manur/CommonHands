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
const userCltr=require('./app/controller/user-Controller')
const ngoCLtr = require('./app/controller/ngo-Controller')
const authenticateUser = require('./app/middleware/authenticateUser')
const authorizeUser = require('./app/middleware/authorizeUser')
const upload = require('./app/middleware/uploadCloudinary')

//-------------------------------------------------------------------------------------------------
//----------------------------------------API Endpoints for user---------------------------------------------
app.post('/api/register', upload, userCltr.register);
app.post('/api/login', userCltr.login);
app.get('/api/profile', authenticateUser, userCltr.show);
//-------------------------------------------------------------------------------------------------
//----------------------------------------API Endpoints for NGO----------------------------------------------
app.post('/api/ngo/register', ngoCLtr.register)
app.post('/api/ngo/upload-documents', authenticateUser, authorizeUser(["NGO"]), upload, ngoCLtr.uploadDoc);
app.put('/api/ngo/verify/:id', authenticateUser, authorizeUser(['Admin']), ngoCLtr.VerifyNgo);
app.get('/api/ngo/profile/', authenticateUser, authorizeUser(['NGO']), ngoCLtr.ngoProfile);
//-------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
