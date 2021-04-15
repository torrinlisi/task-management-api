const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: String,
  description: String,
  due: Date,
  isComplete: Boolean
});

mongoose.connect('mongodb+srv://torrin:MmNu5vLYOVtML9oOgLTB@cluster0.ig46j.mongodb.net/task_management?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;