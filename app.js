const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const middlewareConfig = require("../login/system/middleware/config");

if (process.env.NODE_ENV === "local") {
  require("dotenv").config({
    path: `./${process.env.NODE_ENV}.env`,
  });
} else {
  require("dotenv").config({
    path: `./local.env`,
  });
}

const userInfo = require("./User/route");

app.use(express.json());
app.use(cors(middlewareConfig.cors));
app.use(helmet());
app.use(morgan(middlewareConfig.morganRequestFormat));
app.use(express.urlencoded({ extended: true }));

//public route
app.get("/", () => {
  res.send("hello world");
});

app.use("/user", userInfo);

app.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});
