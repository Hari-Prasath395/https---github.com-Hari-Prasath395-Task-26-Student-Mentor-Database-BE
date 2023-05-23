const express = require("express");
const bodyParser = require("body-parser");
const appServer = require("./app");
const nodeServer = express();
const cors = require('cors');

nodeServer.use(bodyParser.json());
nodeServer.use(bodyParser.urlencoded({ extended: true }));
nodeServer.use(cors());
require("./dbconfig");

nodeServer.use("/api", appServer); 
const port = 8000;

nodeServer.listen(port, () => {
  console.log("Server Started on port", port);
});


