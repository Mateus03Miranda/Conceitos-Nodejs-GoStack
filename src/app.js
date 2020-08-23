const express = require("express");
const cors = require("cors");

const { v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const {id}= request.params;
  const repoIndex=repositories.findIndex(repository=>repository.id===id);
  if(repoIndex<0)
    return response.status("400").json("Repository not found");
  request.repoIndex=repoIndex;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs}= request.body;
  const repository={id:v4(), title, url, techs, likes:0};
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId,(request, response) => {
  const {title, url, techs}= request.body;
  repositories[request.repoIndex].title=title;
  repositories[request.repoIndex].url=url;
  repositories[request.repoIndex].techs=techs;
  return response.json(repositories[request.repoIndex]);
});

app.delete("/repositories/:id",validateRepositoryId,(request, response) => {
  repositories.splice(request.repoIndex,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like",validateRepositoryId,(request, response) => {
  repositories[request.repoIndex].likes++;
  return response.send(repositories[request.repoIndex]);
});

module.exports = app;
