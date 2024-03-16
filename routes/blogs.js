const {Router} = require("express")
const multer = require("multer");
const path = require("path");
const Blog = require("../model/blog")
const Comment = require("../model/comment")

const router = Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, path.resolve("./public/uploads"));
    },
    filename: function (req, file, cb){
        const fileName = `${Date.now()}-${file.originalname}`
        return cb(null, fileName);
    }
});

const upload = multer({storage});

router.get("/add-new", (req, res)=>{
    return res.render("addBlog",{
        user: req.user
    })
})

router.post("/", upload.single("image"), async(req, res)=>{
    const{title, body} = req.body
    await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImgURL: `/uploads/${req.file.filename}`
    })
    return res.redirect("/")
})

router.get("/:id", async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    console.log(comments);
    res.render("blog",{
        blog,
        comments,
        user: req.user
    })
})

router.post("/comment/:blogId", async(req, res)=>{
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })

    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router;