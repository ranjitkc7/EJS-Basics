const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

app.get("/", (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.error("Error reading files directory:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("index", { files });
  });
});

app.post("/create", (req, res) => {
  const fileName = req.body.title.split(" ").join("") + ".txt";
  const filePath = path.join(filesDir, fileName);
  fs.writeFile(filePath, req.body.details, (err) => {
    if (err) {
      console.error("File writing error:", err);
      return res.status(500).send("Error saving file");
    }
    res.redirect("/");
  });
});

app.get('/files/:fileName', (req, res) => {
   fs.readFile(`./files/${req.params.fileName}`, 'utf-8', (err, fileData) => {
      if (err) {
         console.error('Error reading file:', err);
         return res.status(500).send('Error reading file');
      }
      res.render('show', { fileName: req.params.fileName, 
         fileData: fileData });
   })
})
app.get('/edit/:fileName', (req, res) => {
  res.render('edit', { fileName: req.params.fileName });
});

app.post(`/edit`, (req, res) => {
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (err) => {
    if (err) {
      console.error('Error renaming file:', err);
      return res.status(500).send('Error renaming file');
    }
    res.redirect('/');
  });
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
