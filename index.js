const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB connection established");
})

const jobsRouter = require('./routes/jobs');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const registerRouter = require('./routes/register');
const activationRouter = require('./routes/activation')
const supportRouter = require('./routes/support')

app.use('/api/jobs', jobsRouter);
app.use('/api/users', usersRouter);
app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);
app.use('/api/activation', activationRouter);
app.use('/api/support', supportRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})