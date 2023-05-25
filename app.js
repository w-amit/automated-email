import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
const app = express();

// using Middlewares
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "absent",
  })
  .then(() => {
    console.log("Db is connected");
  })
  .catch(() => {
    console.log(e);
  });

const leaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

app.get("/", (req, res) => {
  res.send("Nioce");
});

app.get("/leave/all", async (req, res) => {
  const leaves = await Leave.find({}); //finds every leave

  res.json({
    success: true,
    leaves,
  });
});

app.post("/leave/new", async (req, res) => {
  const { name, email, password, reason } = req.body;

  await Leave.create({
    name,
    email,
    password,
    reason,
  });

  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  const options = {
    from: email,
    to: "amitkr.11392@gmail.com",
    subject: "Sending email with node.js",
    text: "Wow! I have sent a automated email",
  };

  res.send(
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log("Sent: " + info.response);
    })
  );
});

app.listen(7000, () => {
  console.log("Server is running");
});
