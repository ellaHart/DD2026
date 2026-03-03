
// 1. setup a node app with command: npm init
// 2. install express with command: npm install express
// 3. create a file named server.js and add the following code
// 4. start the db with command: brew services start mongodb-community //mac on windows start the mongodb server with command: & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="C:\data\db"
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

//setup db connection
const mongoose = require("mongoose");
// create schemas
const destinationSchema = new mongoose.Schema({
  page: String,
  name: String,
  description: String,
  image: String,
});

const Destination = mongoose.model("destinations", destinationSchema);

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travelsite");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch((err) => console.log(err));

// Serving static files
// review middleware in express under week 7 in black board or https://expressjs.com/en/guide/using-middleware.html
// express.static is a built-in middleware function in Express. It serves static files and is based on serve-static.
// The function takes a root directory from which to serve static assets. In this case, we are serving files from the "static" directory.
app.use(express.static(path.join(__dirname, "static")));
// Parse the body of incoming requests with urlencoded payloads and is based on body-parser. This middleware is used to parse the body of incoming requests and make it available under the req.body property. The extended: true option allows for rich objects and arrays to be encoded into the URL-encoded format, which can be useful for complex data structures.
app.use(express.urlencoded({ extended: true }));
// data

// generate routes
app.get("/", (req, res) => {
  // Homepage route
});

// generate routes to populate destinations page
app.post("/destinations", async (req, res) => {
  // code to add a new destination to the database
  const { page, name, description, image } = req.body;
  console.log(req.body);
  const newDestination = new Destination({
    page,
    name,
    description,
    image,
  });
  await newDestination.save();
  //res.redirect("/destinations");
  res.send("Destination added successfully");
});
// generate routes to display destinations page
app.get("/destinations", async (req, res) => {
  // code to retrieve destinations from the database and render the destinations page
  const destinations = await Destination.find();
  res.render("destinations", { destinations });
}

// start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
