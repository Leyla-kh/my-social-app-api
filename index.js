const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const messageRoute = require("./routes/messages");
const conversationRoute = require("./routes/conversations");
const commentRoute = require("./routes/comment");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

dotenv.config();

// mongoose.set("strictQuery", true);

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to Mongo!");
  }
);

// midelwares
app.use(
  cors({
    origin: "https://my-social-app-cso6.onrender.com",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use("/image", express.static(path.join(__dirname, "/public/image")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const File = req.file;
  res.status(200).json(File);
});

// routes

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comment", commentRoute);

app.listen(8800, () => {
  console.log("server is running");
});
