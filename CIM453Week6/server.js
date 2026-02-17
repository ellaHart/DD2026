// 1. setup a node app with command: npm init
// 2. install express with command: npm install express
// 3. create a file named server.js and add the following code

const express = require("express");
const app = express();
const port = 3000;

// https://www.npmjs.com/package/express-handlebars is a Handlebars view engine for Express which provides a way to render dynamic HTML pages using Handlebars templates. It allows you to separate your HTML structure from your application logic, making it easier to manage and maintain your views. With express-handlebars, you can create reusable templates, partials, and layouts, which can help you build more complex and dynamic web applications efficiently.
const hbs = require("express-handlebars");

app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");
//app.set("views", path.join(__dirname, "views"));
// the path module is used to work with file and directory paths
const path = require("path");

// Serving static files
// express.static is a built-in middleware function in Express. It serves static files and is based on serve-static.
// The function takes a root directory from which to serve static assets. In this case, we are serving files from the "static" directory.
app.use(express.static(path.join(__dirname, "static")));

//data 
const directory = require("./data/directory.json");
console

// generate routes
app.get("/", (req, res) => {
  // sendFile is used to send a file as a response
  let filePath = path.join(__dirname, "static", "homepage.html");
  res.sendFile(filePath);
});

//rendering templates
app.get("/home", (req, res) => {
  res.render("home", { title: "My Website's homepage" });
});

app.get("/about", (req, res) => {
  // sendFile is used to send a file as a response
  let filePath = path.join(__dirname, "static", "about.html");
  res.sendFile(filePath);
});

app.get("/images/sample.jpg", (req, res) => {
  let filePath = path.join(__dirname, "static", "images", "sample.jpg");
  res.sendFile(filePath);
});
// HTTP METHODS GET POST PUT DELETE
//GET
app.get("/api/items", (req, res) => {
  res.send("this is a get response from /api/items");
});
//POST
app.post("/api/items", (req, res) => {
  res.send("this is a post response from /api/items");
});
//PUT
app.put("/api/items/:id", (req, res) => {
  res.send(`this is a put response from /api/items/`);
});
//DELETE
app.delete("/api/items/:id", (req, res) => {
  res.send(`this is a delete response from /api/items/`);
});

//Directory route

app.get("/directory/:id", (req, res) => {
  res.render("directory", { people: directory })
});

// start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});