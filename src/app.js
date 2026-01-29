const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();

app.use(cors({
    origin: "https://antarsia.onrender.com",
    credentials: true
  }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/members", require("./routes/members.routes"));
app.use("/api/pdf", require("./routes/pdf.routes"));

module.exports = app; 