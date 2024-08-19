/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const { exit } = require("process");

let dbConn = {};

if (
  process.env.MONGO_CONN_STRING &&
  process.env.MONGO_DB_NAME &&
  process.env.MONGO_AUTH_SOURCE
) {
  dbConn = mongoose.createConnection(
    `${process.env.MONGO_CONN_STRING}${process.env.MONGO_DB_NAME}?authSource=${process.env.MONGO_AUTH_SOURCE}`,
    {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
    }
  );
  dbConn.on("connected", () => {
    console.log("MongoDB connection established");
  });
  dbConn.on("error", (err) => {
    console.log(`MongoDB connection error: ${err}`);
  });
} else {
  console.log("ERROR: DB CONNECTION NOT INITIALISED");
}
function closeDbConn() {
  dbConn.close(() => {
    console.log("Closing mongo connection and exiting process");
    process.exit(0);
  });
}

module.exports = {
  dbConn,
  closeDbConn,
};
