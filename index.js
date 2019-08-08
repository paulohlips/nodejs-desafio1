const express = require("express");
const server = express();

const myProjs = [
  {
    id: 1,
    title: "Project 1",
    tasks: []
  },
  {
    id: 2,
    title: "Project 2",
    tasks: []
  }
];
let reqCounter = 0;

server.use(express.json());
//middleware for logs
server.use((req, res, next) => {
  reqCounter++;
  console.log(`Reqs: ${reqCounter} |Method: ${req.method}, URL: ${req.url}`);
  return next();
});

//middleware to verify ID
function checkID(req, res, next) {
  const { id } = req.params;
  const proj = myProjs.find(p => p.id == id);

  if (!proj) {
    return res.status(400).json({ error: "Project does't exist." });
  }

  return next();
}

//list projects
server.get("/projects", (req, res) => {
  return res.json(myProjs);
});
//create new projects
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const proj = {
    id,
    title,
    tasks: []
  };

  myProjs.push(proj);
  return res.json(myProjs);
});
//edit project
server.put("/projects/:id", checkID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const proj = myProjs.find(p => p.id == id);
  proj.title = title;

  return res.json(myProjs);
});
//create task
server.post("/projects/:id/tasks", checkID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const proj = myProjs.find(p => p.id == id);
  proj.tasks.push(title);

  return res.json(myProjs);
});
//delete project
server.delete("/projects/:id", checkID, (req, res) => {
  const { id } = req.params;

  const projectIndex = myProjs.findIndex(p => p.id == id);

  myProjs.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
