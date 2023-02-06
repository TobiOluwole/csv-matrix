const express = require("express");
const app = express();
const path = require("path");
const multer  = require('multer')
const upload = multer()
const port = 3000 || process.env.port;

const matrixController = require('./controller/matrix')

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});


const cpUpload = upload.fields([{ name: 'index' }, { name: 'matrix'}])
app.post("/api/create-matrix",cpUpload, matrixController.graph);


app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
