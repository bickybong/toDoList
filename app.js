const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const newItems = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function (req, res) {
  const day = date.getDate()
  res.render("list", { listTitle: day, newListItems: newItems });
  //   Sends variables and runs list.ejs in views folder
});

app.post("/", function (req, res) {
  // submitted items in new var
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    //push submited item into array
    workItems.push(item);
    res.redirect("/work");
  } else {
    newItems.push(item);
    // redirect back to app.get home page
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about", { listTitle: "Work List", newListItems: workItems });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
