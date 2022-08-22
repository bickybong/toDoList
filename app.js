const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var newItems = ["Buy Food","Cook Food","Eat Food"];
app.get("/", function (req, res) {
  var today = new Date();
  var currentDay = today.getDay();
  var options = { 
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US", options);
  res.render("list", { kindOfDay: day, newListItems: newItems });
//   Sends variables and runs list.ejs in views folder
});

app.post("/", function (req, res) {
    // submitted items in new var
    newItem = req.body.newItem;
    //push submited item into array
    newItems.push(newItem);
    // redirect back to app.get home page
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
