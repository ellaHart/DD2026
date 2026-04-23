// 1. setup a node app with command: npm init
// 2. install express with command: npm install express
// 3. create a file named server.js and add the following code
// 4. start the db with command: brew services start mongodb-community //mac on windows start the mongodb server with command: & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="C:\data\db"
const express = require("express");
const app = express();
// change port to 3001 to avoid conflict with React development server which runs on port 3000 by default
const port = 3001;

// https://www.npmjs.com/package/express-handlebars is a Handlebars view engine for Express which provides a way to render dynamic HTML pages using Handlebars templates. It allows you to separate your HTML structure from your application logic, making it easier to manage and maintain your views. With express-handlebars, you can create reusable templates, partials, and layouts, which can help you build more complex and dynamic web applications efficiently.
const hbs = require("express-handlebars");

app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");
//app.set("views", path.join(__dirname, "views"));
// the path module is used to work with file and directory paths
const path = require("path");
// setup uploads directory for storing uploaded images
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer(storage);

//setup db connection
const mongoose = require("mongoose");
const { title } = require("process");
// create schemas
const pageSchema = new mongoose.Schema({
  slug: String, //about-us friendly url
  name: String, //About Us
  description: String,
});
const gallerySchema = new mongoose.Schema({
  name: String,
  description: String,
});
const imageSchema = new mongoose.Schema({
  url: String,
  caption: String,
  gallery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "galleries",
  },
});

const destinationSchema = new mongoose.Schema(
  {
    page: String,
    name: String,
    description: String,
    image: String,
  },
  {
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// See virtuals in mongoose documentation https://mongoosejs.com/docs/guide.html#virtuals
destinationSchema.virtual("activities", {
  ref: "activities",
  localField: "_id",
  foreignField: "destination",
});

// Add virtual field for the gallery to the image schema
gallerySchema.virtual("images", {
  ref: "images",
  localField: "_id",
  foreignField: "gallery",
});
// Activities schema for things to do in each destination
const activitySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  cost: Number,
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "destinations",
  },
});

const Destination = mongoose.model("destinations", destinationSchema);

const Activity = mongoose.model("activities", activitySchema);

const Page = mongoose.model("pages", pageSchema);

const Gallery = mongoose.model("galleries", gallerySchema);

const Image = mongoose.model("images", imageSchema);

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
// Set up Basic CORS headers for communicating with APIs and accept POST, PUT, DELETE, GET requests from any origin. This middleware is used to set the CORS headers for the responses. The Access-Control-Allow-Origin header allows requests from any origin, and the Access-Control-Allow-Headers header specifies which headers are allowed in the requests.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin. This should not be used in production without proper security measures in place.
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// generate routes
app.get("/", async (req, res) => {
  // Homepage route
  // Find the home page in the database and render it with the title "Welcome to Travel Site"
  const homePage = await Page.findOne({ slug: "home" }).lean();
  //Bring in the gallery
  const gallery = await Gallery.findOne({ name: "home" })
    .populate("images")
    .lean();

  const destinations = await Destination.find().lean();
  res.render("home", {
    title: homePage.name,
    description: homePage.description,
    galleryImages: gallery.images,
    destinations: destinations,
  });
});

// generate routes to populate destinations page
app.post("/api/destinations", upload.single("image"), async (req, res) => {
  // code to add a new destination to the database
  const { page, name, description } = req.body;
  const image = req.file; // Get the path of the uploaded image
  console.log(req.body);
  const newDestination = new Destination({
    page,
    name,
    description,
    image: image.filename ? `/images/${image.filename}` : "/images/default.jpg", // Store the path to the image in the database
  });
  await newDestination.save();
  //res.redirect("/destinations");
  res.send("Destination added successfully");
});
// generate routes to display destinations page
app.get("/destinations", async (req, res) => {
  // code to fetch destinations from the database and render the destinations page
  // .lean() is a method in Mongoose that is used to convert a Mongoose document into a plain JavaScript object. When you query the database using Mongoose, it returns a Mongoose document, which has additional methods and properties that are not present in a plain JavaScript object. By calling .lean(), you can get a plain JavaScript object instead of a Mongoose document, which can be more efficient for read-only operations where you don't need the additional functionality provided by Mongoose documents.
  const destinations = await Destination.find().lean();
  res.render("destinations", {
    destinations: destinations,
    title: "Destinations",
  });
});
// Get a specific destination by _id
app.get("/destinations/:id", async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id)
    .populate("activities")
    .lean();
  //const activities = await Activity.find({ destination: id }).lean();
  res.render("details", {
    destination: destination,
    title: destination.name,
    activities: destination.activities,
  });
});

// activities routes
app.post("/activities", async (req, res) => {
  const { name, description, image, cost, destination } = req.body;
  const newActivity = new Activity({
    name,
    description,
    image,
    cost,
    destination,
  });
  await newActivity.save();
  res.send("Activity added successfully");
});

// Create a new page
app.post("/pages", async (req, res) => {
  const { slug, name, description } = req.body;
  const newPage = new Page({
    slug,
    name,
    description,
  });
  await newPage.save();
  res.send("Page added successfully");
});
// Create a new gallery
app.post("/galleries", async (req, res) => {
  const { name, description } = req.body;
  const newGallery = new Gallery({
    name,
    description,
  });
  await newGallery.save();
  res.send("Gallery added successfully");
});
// Create a new image
app.post("/images", async (req, res) => {
  const { url, caption, gallery } = req.body;
  const newImage = new Image({
    url,
    caption,
    gallery,
  });
  await newImage.save();
  res.send("Image added successfully");
});
// setup basic api routes
app.get("/api/destinations", async (req, res) => {
  const destinations = await Destination.find().lean();
  res.json(destinations);
});
// Get a specific destination by _id
app.get("/api/destinations/:id", async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id)
    .populate("activities")
    .lean();
  //const activities = await Activity.find({ destination: id }).lean();
  res.json(destination);
});

// start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});