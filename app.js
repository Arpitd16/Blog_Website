//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Every day brings new thoughts, experiences, and emotions—and writing them down helps you remember, reflect, and grow. This is your personal space to write about your daily life, no matter how big or small the moment is. The Daily Journal is designed to help you build a habit of writing. Whether it’s something exciting that happened, a small moment of joy, a difficult feeling, or just a few words to remember the day, this is where you can put it all. Over time, these entries become a story—your story.\n You don’t have to be a professional writer. This journal is for you. There are no rules. Some people like to write long reflections, others just write a few lines. You might talk about your goals, your thoughts, something you learned, or even just what you had for breakfast. It's all valid. The important part is that you're taking a few minutes each day for yourself.This site keeps your entries organized by date so you can look back and see how your thoughts and life have evolved. It’s like creating a time machine made of your own words.";
const aboutContent = "Daily Journal is a simple and personal blogging platform designed to help you write about your life—one day at a time.We believe that writing a little every day can help clear your mind, track your growth, and keep your memories alive. Whether you want to write about your day, express your thoughts, or just jot down a few lines, this is your space.This site makes it easy to start journaling. No complicated features, no distractions—just a clean and peaceful place to write. You don’t need to be a writer or share your posts with anyone. This journal is just for you.Write when you want, how you want. Over time, you'll build a beautiful collection of your personal journey.Start writing today and see where your thoughts take you.";
const app = express();
const contactContent = `
If you have any questions or feedback, feel free to reach out to us!

Email: arpitdhameliya1@gmail.com
Phone: +919624458906  

We're always happy to hear from our users. Whether it's suggestions, ideas, or concerns, we're here to listen.

Thank you for being a part of Daily Journal!
`;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useUnifiedTopology: true }, {useNewUrlParser: true},{useFindAndModify: false},{useCreateIndex: true});
// mongoose.connect("mongodb+srv://adm61:Arpit1234@cluster0.lv71sm5.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0", { useUnifiedTopology: true }, {useNewUrlParser: true});

//mongoose.connect("mongodb://localhost:27017/blogDB", { useUnifiedTopology: true }, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent.replace(/\n/g,"<br>"),
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent.replace(/\n/g, "<br>") });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
