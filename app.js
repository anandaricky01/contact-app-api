const express = require("express");
const url = require("url");

const app = express();
const PORT = 3000;

const db = require("./app/models/index");

// check connection to the database
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log("Can't Connect to the Database!", err);
    process.exit();
  });

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Aplikasi",
  });
});

// daftarkan routes yang telah ditulis pada app/routes
require('./app/routes/post.routes')(app);

app.listen(PORT, () => {
  console.log(`Mongo Contact App | Listening at http://localhost:${PORT}`);
});
