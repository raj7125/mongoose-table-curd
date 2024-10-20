const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const Image = require("./models/Image");

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect("mongodb+srv://Niladri:Niladri123@cluster0.bwjbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
}).then(() => {
  console.log("Database connected");
}).catch((error) => {
  console.log("Connection Failed", error);
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


app.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    res.render("home", { images });
  } catch (error) {
    res.status(500).send("Error retrieving images");
  }
});


app.get("/create", (req, res) => {
  res.render("create");
});


app.post("/create", upload.single("image"), async (req, res) => {
  const { name, email } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;
  
  const image = new Image({ name, email, imagePath });
  try {
    await image.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error saving image");
  }
});

// Update route to get specific image
app.get("/update/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    res.render("update", { image });
  } catch (error) {
    res.status(500).send("Error retrieving image");
  }
});

// Update route to handle form submission
app.post("/update/:id", upload.single("image"), async (req, res) => {
  const { name, email } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    await Image.findByIdAndUpdate(req.params.id, {
      name,
      email,
      imagePath: imagePath || undefined,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error updating image");
  }
});

// Delete route
app.post("/delete/:id", async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting image");
  }
});


// View route to display specific image details
app.get("/view/:id", async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) {
        return res.status(404).send("Image not found");
      }
      res.render("view", { image });
    } catch (error) {
      res.status(500).send("Error retrieving image details");
    }
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// Mongoose-CURD/
// │
// ├── models/
// │   └── Image.js             
// │
// ├── views/
// │   ├── home.ejs             
// │   ├── create.ejs           
// │   ├── update.ejs           
// │   └── view.ejs              
// │
// ├── public/
// │   └── uploads/              
// │                 
// │                  
// │
// ├── server.js                 
// ├── package.json               
                
