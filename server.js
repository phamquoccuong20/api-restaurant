require("dotenv").config();
const express = require("express"); //commonjs
const connectDB = require("./config/database");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const app = express();
const port = process.env.PORT || 8888;
const { errorHandler } = require("./middleware/errorHandler");
const categoryRouter = require("./routers/categoryRouter");
const tableRouter = require("./routers/tableRouter");
const menuRouter = require("./routers/menuRouter");

app.use(cors());
//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
app.use(errorHandler);

app.listen(port, () => {
  try {
    console.log(`Backend Nodejs App listening on port ${port}`);
    connectDB();
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/tables", tableRouter);
app.use("/api/v1/menus", menuRouter);
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
});
