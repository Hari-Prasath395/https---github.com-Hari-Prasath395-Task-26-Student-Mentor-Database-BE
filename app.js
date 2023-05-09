const express = require("express");
const studentRouter = require('./Controllers/students.controller');
const mentorRouter = require('./Controllers/mentors.controller') ;
const appServer = express();


appServer.use("/student",studentRouter);
appServer.use("/mentor",mentorRouter);

module.exports = appServer;
