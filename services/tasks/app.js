const express = require('express');
const Task = require('./model');
var cors = require('cors')

const app = express();
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json());

//get tasks with or without filter
app.get('/', (req, res) => {
  let filter = req.query.filter
  let currentDate = new Date().getTime();
  let upcomingDate = new Date().setDate(new Date().getDate() + 2);

  let searchParams;
  //get tasks that are incomplete and are upcoming
  if(filter === 'upcoming')
    searchParams = {
      due: {
        $gte: currentDate,
        $lte: upcomingDate
      },
      isComplete: false
    };
  //gets tasks that are incomplete and are past due
  else if(filter === 'overdue')
    searchParams = {
      due: {
        $lte: currentDate
      },
      isComplete: false
    };
  //gets completed tasks
  else if(filter === 'completed')
    searchParams = {
      isComplete: true
    };
  //urgent is upcoming + overdue
  else if(filter === 'urgent')
    searchParams = {
      due: {
        $lte: upcomingDate
      },
      isComplete: false
    };
  //default to all
  else
    searchParams = {};

  //perform the find
  Task.find(searchParams, (err, tasks) => {
    if(err) res.send(err);
    else res.json(tasks);
  });
});

//update task (isComplete)
app.put('/', (req, res) => {
  let searchParam = {
    _id: req.body._id
  }

  let updateObj = {
    isComplete: req.body.isComplete
  }

  //update record
  Task.updateOne(searchParam, updateObj, function (err) {
    if (err) res.send(err);
    else res.send("Success!");
  });
});

//delete task
app.delete('/', (req, res) => {
  let searchParam = {
    _id: req.body._id
  }

  //update record
  Task.deleteOne(searchParam, function (err) {
    if (err) res.send(err);
    else res.send("Success!");
  });
});

//create task
app.post('/', (req, res) => {
  //create task instance
  let taskInstance = new Task({
    'name': req.body.name, 
    'description': req.body.description, 
    'due': req.body.due, 
    'isComplete': false
  })

  //save instance to mongo
  taskInstance.save(function (err) {
    if (err) res.send(err);
    res.send("Success!");
  });
});

module.exports = app;