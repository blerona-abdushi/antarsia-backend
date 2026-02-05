const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const membersRoutes = require("./routes/members.routes");

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: "https://antarsia-backend.onrender.com",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);

module.exports = app;
