const express = require("express");
const dotenv = require("dotenv");
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const DbConnection = require("./db/DbConnection");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/auth");
const issueRouter=require("./routes/Issue")
const feedbackRouter=require("./routes/Feedback")
const departmentRouter=require("./routes/Departments")
const adminRouter=require("./routes/Admin")
const conversationRouter=require("./routes/Conversations")
const path=require('path')
const bodyParser=require('body-parser')
const cors = require("cors");
const app = express();
dotenv.config();
require("./passport");

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
DbConnection();
app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
app.use(
  cors({
    origin: allowedOrigins,
    methods: "PUT,POST,GET,DELETE",
    credentials: true,
  })
);
app.use("/api/users", userRouter);
app.use("/api/issue",issueRouter)
app.use("/api/feedback", feedbackRouter);
app.use("/api/department", departmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/conversations",conversationRouter)

app.get("", (req, res) => {
  res.send("Helooo");
});

app.use("/auth", authRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
