const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const userroutes = require("./routes/user.route");
const postroutes = require("./routes/post.route");
const messageroutes = require("./routes/message.route");
const storyroutes = require("./routes/story.route"); // ✅ NEW: Story routes
const reelRouter = require("./routes/reel.route");

require("./controller/story.controller"); // ✅ Load story cron job

const { app, server } = require("./Socket");

dotenv.config();

const port = 7777;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userroutes);
app.use("/api/v1/post", postroutes);
app.use("/api/v1/message", messageroutes);
app.use("/api/v1/story", storyroutes); // ✅ Mount story routes
app.use("/api/v1/reel", reelRouter);


db();

app.get("/", (req, res) => {
  res.send("iam coming from server");
  console.log("home");
});

server.listen(port, () => {
  console.log(`🚀 server is listening at port ${port}`);
});
