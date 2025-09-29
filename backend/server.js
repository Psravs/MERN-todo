
// importing express framewrk
const express = require("express");
// importing mongoose for mongodb connection
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//enabling CORS for all origins
app.use(cors());
app.use(express.json());

// mongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schema + model
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true }
});
const Todo = mongoose.model("Todo", todoSchema);

//routes
// fetch tasks 
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// post/ add task 
app.post("/todos", async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

// delete task
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// update task  
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );
  res.json(todo);
});


const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
