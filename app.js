//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose =  require("mongoose");

const path = require("path");

const _ = require("lodash");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Rekha:Rekha13@cluster0.uihvcdf.mongodb.net/blogpostsDB");


// console.log(process.env.PORT);

const blogSchema = new mongoose.Schema({
  title : String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();



// app.set('views', './views');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
// app.use(express.static(__dirname + '../public'));

app.use('/static',express.static(path.join(__dirname + 'public')));

//The code sample above assumes that you have an index.ejs depending on your views engine, file located in a views directory in your root folder.

app.set('view engine', 'ejs');
// let posts = []; will add to db

app.get("/", function(req, res){

  Blog.find({},function(err, foundposts){
    res.render("home", {homeContent :homeStartingContent, numofpost:foundposts});
  });
 
  // // res.send(homeStartingContent);  
  // console.log(posts);
  // for (var i = 0; i<posts.length; i++)
  //     console.log(posts[i].title);
});

app.get("/about" , function(req, res){
  res.render("about", {about_Content : aboutContent});
});

app.get("/contact" , function(req, res){
  res.render("contact", {contact_Content : contactContent});
});

app.get("/compose" , function(req, res){

  res.render("compose");



});

app.post("/compose", function(req,res){
 /* const post ={
    title:req.body.titleText,
    content: req.body.postBody
  };*/

//add to db:
  const post = new Blog({
    title:req.body.titleText,
    content: req.body.postBody
  })

  post.save(function(err){
    if(!err)
    res.redirect("/");
  });

  // posts.push(post);
  // res.redirect("/");
  // console.log(posts);
  // console.log("title: "+post.title);
  // console.log("post: "+post.content);
})

let storedbody = '';
//routing paramaters
app.get("/posts/:topicid" , function(req, res){
  // const topictitle = _.lowerCase(req.params.topic);
  const requestedpostid = req.params.topicid;  //entered in compose/posts/.....
  // console.log(topictitle);
  // for (var i = 0; i<posts.length; i++){
    /*posts.forEach(function(post){
    // console.log(posts[i].title);
    const storedPostTitle = _.lowerCase(post.title);//stored in home after entered in compose page
    storedbody = post.content;
    console.log(storedPostTitle);*/
    // if(posts[i].title == topictitle){

    Blog.findOne({_id:requestedpostid},function(err, foundpost){
      if(!err){
      res.render("post" ,
      { postTitle :foundpost.title, postcontent : foundpost.content });
    }else{
           console.log("not found", err);
       }
    });
  //     if (storedPostTitle === topictitle){
  //     console.log("match found");
  // res.render("post" ,
  //     { postTitle :post.title, postcontent : post.content });
      
  //   else{
  //     console.log("not found");
  //   }
  
  // });
  
});

let port = process.env.PORT;

console.log(port);
if(port == null ||port == ""){
    port =3000;
}


app.listen(port, function(){
        console.log(`server running suucessfullly ${port}` );
        // console.log(__dirname);
        // console.log(path.join(__dirname + '/public'));
     
    });

    //local setup only
// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });

// Export the Express API for vercel deployment
module.exports = app;
