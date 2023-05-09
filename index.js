const express = require("express");
const bodyParser = require("body-parser");
const appServer = require("./app");
const nodeServer = express();

nodeServer.use(bodyParser.json());
nodeServer.use(bodyParser.urlencoded({ extended: true }));

require("./dbconfig");

nodeServer.use("/api", appServer); 
const port = 3000;

nodeServer.listen(port, () => {
  console.log("Server Started on port", port);
});


