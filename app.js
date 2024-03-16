require("dotenv").config();

const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/authentication")
const blogRoute = require("./routes/blogs")
const Blog = require("./model/blog")

const app = express();
const PORT = process.env.PORT ;

//Connection
mongoose.connect(process.env.MONGO_URL).then((e)=>{console.log("MongoDB connected")});

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));

//Routes
app.get("/", async(req, res)=>{
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
})
app.use("/user",userRoute)
app.use("/blog", blogRoute);


//Listener
app.listen(PORT, ()=>{console.log(`Server Started:`,PORT)});