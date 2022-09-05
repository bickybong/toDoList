const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//item schema
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
  name: String,
};
//model
const Item = mongoose.model("Item", itemsSchema);
//items
const item1 = new Item({
  name: "Welcome to the toDoList!",
});
const item2 = new Item({
  name: "Hit the + to add a new item",
});
const item3 = new Item({
  name: "<-- hit this to delete",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find(function (err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to database");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });
  //   Sends variables and runs list.ejs in views folder
});

app.get("/:customeListName", function (req, res) {
  const customeListName = _.capitalize(req.params.customeListName);
  List.findOne({ name: customeListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new list
        const list = new List({
          name: customeListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customeListName);
      } else {
        //show existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  // add submitted items in new var
  const item = req.body.newItem;
  listName = req.body.list;
  const itemNew = new Item({
    name: item,
  });
  if (listName == "Today") {
    itemNew.save();
    //redirect to home route to update
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(itemNew);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndDelete(checkedId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted checked item");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } },
      function (err, foundList) {
        res.redirect("/" + listName);
      }
    );
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
