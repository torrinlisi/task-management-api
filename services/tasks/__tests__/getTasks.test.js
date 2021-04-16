const server = require("../server");
// const mongoose = require("mongoose");
const supertest = require("supertest");
const Task = require("../model.js");

//these should be used instead of the default mongoose connection
// beforeEach((done) => {
//   mongoose.connect("mongodb+srv://torrin:MmNu5vLYOVtML9oOgLTB@cluster0.ig46j.mongodb.net/myFirstDatabase",
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => done());
// });

//wipe testing data after each test
afterEach(async (done) => {
  await Task.deleteMany({});
  done();
});

test("GET /", async () => {
  await supertest(server).get("/").expect(200);
});

test("POST /", async () => {
  const task = await Task.create({ name: "test", description: "test desc", due: new Date(), isComplete: false });

  await supertest(server).post("/").send(task).expect(200);
});

test("GET / with record no filter", async () => {
  const task = await Task.create({ name: "test", description: "test desc", due: new Date(), isComplete: false });

  await supertest(server).post("/").send(task).expect(200);

  await supertest(server).get("/")
    .expect(200)
    .then((response) => {
      expect(response.body[0]._id).toBe(task.id);
      expect(response.body[0].name).toBe(task.name);
      expect(response.body[0].description).toBe(task.description);
      expect(response.body[0].due).toBe(task.due.toISOString());
      expect(response.body[0].isComplete).toBe(task.isComplete);
    })
});

test("GET / with upcoming filter", async () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);

  const task = await Task.create({ name: "test", description: "test desc", due: new Date(date), isComplete: false });

  await supertest(server).post("/")
    .send(task)
    .expect(200);

  await supertest(server).get("/")
    .query({ filter: 'upcoming' })
    .expect(200)
    .then((response) => {
      expect(response.body[0]._id).toBe(task.id);
      expect(response.body[0].name).toBe(task.name);
      expect(response.body[0].description).toBe(task.description);
      expect(response.body[0].due).toBe(task.due.toISOString());
      expect(response.body[0].isComplete).toBe(task.isComplete);
    })
});

test("GET / with overdue filter", async () => {
  let date = new Date();
  date.setDate(date.getDate() - 2);

  const task = await Task.create({ name: "test", description: "test desc", due: new Date(date), isComplete: false });

  await supertest(server).post("/")
    .send(task)
    .expect(200);

  await supertest(server).get("/")
    .query({ filter: 'overdue' })
    .expect(200)
    .then((response) => {
      expect(response.body[0]._id).toBe(task.id);
      expect(response.body[0].name).toBe(task.name);
      expect(response.body[0].description).toBe(task.description);
      expect(response.body[0].due).toBe(task.due.toISOString());
      expect(response.body[0].isComplete).toBe(task.isComplete);
    })
});

test("GET / with urgent filter", async () => {
  let overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - 2);

  const task1 = await Task.create({ name: "test", description: "test desc", due: new Date(overdueDate), isComplete: false });

  await supertest(server).post("/")
    .send(task1)
    .expect(200);

  let upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() - 2);
  const task2 = await Task.create({ name: "test", description: "test desc", due: new Date(upcomingDate), isComplete: false });

  await supertest(server).post("/")
    .send(task2)
    .expect(200);

  await supertest(server).get("/")
    .query({ filter: 'urgent' })
    .expect(200)
    .then((response) => {
      expect(response.body[0]._id).toBe(task1.id);
      expect(response.body[0].name).toBe(task1.name);
      expect(response.body[0].description).toBe(task1.description);
      expect(response.body[0].due).toBe(task1.due.toISOString());
      expect(response.body[0].isComplete).toBe(task1.isComplete);

      expect(response.body[1]._id).toBe(task2.id);
      expect(response.body[1].name).toBe(task2.name);
      expect(response.body[1].description).toBe(task2.description);
      expect(response.body[1].due).toBe(task2.due.toISOString());
      expect(response.body[1].isComplete).toBe(task2.isComplete);
    })
});

test("GET / with completed filter", async () => {
  const task = await Task.create({ name: "test", description: "test desc", due: new Date(), isComplete: true });

  await supertest(server).post("/")
    .send(task)
    .expect(200);

  await supertest(server).get("/")
    .query({ filter: 'completed' })
    .expect(200)
    .then((response) => {
      expect(response.body[0]._id).toBe(task.id);
      expect(response.body[0].name).toBe(task.name);
      expect(response.body[0].description).toBe(task.description);
      expect(response.body[0].due).toBe(task.due.toISOString());
      expect(response.body[0].isComplete).toBe(task.isComplete);
    })
});

test("PUT / complete", async () => {
  const task = await Task.create({ name: "test", description: "test desc", due: new Date(), isComplete: false });

  await supertest(server).post("/").send(task).expect(200);

  const putObj = {
    _id: task.id,
    isComplete: true
  }
  await supertest(server).put("/").send(putObj).expect(200);
});

test("PUT / uncomplete", async () => {
  const task = await Task.create({ name: "test", description: "test desc", due: new Date(), isComplete: true });

  await supertest(server).post("/").send(task).expect(200);

  const putObj = {
    _id: task.id,
    isComplete: false
  }
  await supertest(server).put("/").send(putObj).expect(200);
});

test("Delete /", async () => {
  const task = await Task.create({ name: "test", description: "test desc", due: new Date(), isComplete: false });

  await supertest(server).post("/").send(task).expect(200);

  const putObj = {
    _id: task.id
  }
  await supertest(server).delete("/").send(putObj).expect(200);
});