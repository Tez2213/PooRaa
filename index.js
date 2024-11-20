const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Sample posts data
let posts = [
  {
    id: uuidv4(),
    username: "Tejasvi Kesarwani",
    content: "Today, I am in IIITD",
    img: "https://th.bing.com/th/id/OIP.l2ea8gsZtSwdfehFMv9CIgHaJQ?w=155&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  },
  {
    id: uuidv4(),
    username: "Anant",
    content: "Mujhe khaana hain",
    img: "https://th.bing.com/th/id/OIP.8u18PqEZUJdWVJbvqMf2JQHaE9?rs=1&pid=ImgDetMain",
  },
  {
    id: uuidv4(),
    username: "Kunal",
    content: "juice Peee laaaadooo!!!",
    img: "https://th.bing.com/th/id/OIP.54lzvSYm9sYvTGzA_ZdPFQHaE8?w=274&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  },
];

// Display all posts
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Show the form to create a new post
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Create a new post
app.post("/posts", (req, res) => {
  let { username, content, img } = req.body;
  let id = uuidv4(); // Generate a unique ID
  posts.push({ id, username, content, img });
  res.redirect("/posts");
});

// Show a single post
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).send("Post not found!");
  }

  res.render("show.ejs", { post });
});

// Show the edit form for a post
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).send("Post not found!");
  }

  res.render("edit.ejs", { post });
});

// Update a post with PATCH
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let { content, username, img } = req.body;

  // Trim content to remove extra spaces or newlines
  content = content.trim();

  let post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).send("Post not found!");
  }

  post.content = content;
  post.username = username;
  post.img = img;

  console.log(post); // Log updated post

  res.redirect("/posts");
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;

  // Filter out the post with the matching id
  posts = posts.filter((p) => p.id !== id);

  res.redirect("/posts"); // Redirect to the posts list after deletion
});

app.listen(port, () => {
  console.log("Server running on port 8080");
});
