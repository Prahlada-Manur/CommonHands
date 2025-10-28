const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port =process.env.PORT || 3070
const app = express();
app.use(express.json())
app.use(cors())
//-------------------------------------------------------------------------------------------------
const configDb = require('./config/configDb')
configDb()
//-------------------------------------------------------------------------------------------------
const userCltr= require('./app/controller/user-COntroller')
const authenticateUser=require('./app/middleware/authenticateUser')
app.post('/api/register', userCltr.register);
app.post('/api/login', userCltr.login);
app.get('/api/profile', authenticateUser, userCltr.show);
//-------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

