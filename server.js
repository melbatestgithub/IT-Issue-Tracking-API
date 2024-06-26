const express = require("express");
const dotenv = require("dotenv");
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const DbConnection = require("./db/DbConnection");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/auth");
const issueRouter = require("./routes/Issue");
const feedbackRouter = require("./routes/Feedback");
const departmentRouter = require("./routes/Departments");
const adminRouter = require("./routes/Admin");
const conversationRouter = require("./routes/Conversations");
const messageRouter = require("./routes/Messages");
const path = require('path');
const bodyParser = require('body-parser');
const dashboardData = require("./routes/DashboardData");
const Report = require("./routes/Report");
const FAQ = require("./routes/FAQ");
const categoryRouter = require("./routes/Category");
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
app.use(bodyParser.json()); 

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001',
  'https://it-portal-self.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: "PUT,POST,GET,DELETE",
  credentials: true,
}));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/issue", issueRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/department", departmentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/dashboard", dashboardData);
app.use("/api/report", Report);
app.use("/api/FAQ", FAQ);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);

app.get("", (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port 5600")
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
