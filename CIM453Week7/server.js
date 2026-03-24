// 1. setup a node app with command: npm init
// 2. install express with command: npm install express
// 3. create a file named server.js and add the following code
// 4. start the db with command: brew services start mongodb-community //mac on windows start the mongodb server with command: & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="C:\data\db"
const express = require("express");
const app = express();
const port = 3000;

const hbs = require("express-handlebars");
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");

const path = require("path");

//setup db connection
const mongoose = require("mongoose");
const { title } = require("process");

// create schemas
const pageSchema = new mongoose.Schema({
  slug: String,
  name: String,
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
  }
);
destinationSchema.virtual("activities", {
  ref: "activities",
  localField: "_id",
  foreignField: "destination",
});
gallerySchema.virtual("images", {
  ref: "images",
  localField: "_id",
  foreignField: "gallery",
});
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
}
main().catch((err) => console.log(err));

// Middleware
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));

// =====================
// ROUTES
// =====================

// Home
app.get("/", async (req, res) => {
  const homePage = await Page.findOne({ slug: "home" }).lean();
  const gallery = await Gallery.findOne({ name: "home" }).populate("images").lean();
  const destinations = await Destination.find().lean();
  res.render("home", {
    title: homePage.name,
    description: homePage.description,
    galleryImages: gallery.images,
    destinations: destinations,
  });
});

// Destinations - get all
app.get("/destinations", async (req, res) => {
  const destinations = await Destination.find().lean();
  res.render("destinations", {
    destinations: destinations,
    title: "Destinations",
  });
});

// Destinations - search (must be BEFORE /:id)
app.get("/destinations/search", async (req, res) => {
  const { q } = req.query;
  const destinations = await Destination.find({
    name: { $regex: q, $options: "i" },
  }).lean();
  res.render("destinations", {
    destinations: destinations,
    title: "Search Results for: " + q,
  });
});

// Destinations - get one by id (must be AFTER /search)
app.get("/destinations/:id", async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id)
    .populate("activities")
    .lean();
  res.render("details", {
    destination: destination,
    title: destination.name,
    activities: destination.activities,
  });
});

// Destinations - create
app.post("/destinations", async (req, res) => {
  const { page, name, description, image } = req.body;
  const newDestination = new Destination({ page, name, description, image });
  await newDestination.save();
  res.send("Destination added successfully");
});

// Activities - create
app.post("/activities", async (req, res) => {
  const { name, description, image, cost, destination } = req.body;
  const newActivity = new Activity({ name, description, image, cost, destination });
  await newActivity.save();
  res.send("Activity added successfully");
});

// Pages - create
app.post("/pages", async (req, res) => {
  const { slug, name, description } = req.body;
  const newPage = new Page({ slug, name, description });
  await newPage.save();
  res.send("Page added successfully");
});

// Galleries - create
app.post("/galleries", async (req, res) => {
  const { name, description } = req.body;
  const newGallery = new Gallery({ name, description });
  await newGallery.save();
  res.send("Gallery added successfully");
});

// Images - create
app.post("/images", async (req, res) => {
  const { url, caption, gallery } = req.body;
  const newImage = new Image({ url, caption, gallery });
  await newImage.save();
  res.send("Image added successfully");
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});