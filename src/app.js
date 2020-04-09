const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const validateRepositorieId = (request, response, next) => {
  const { id } = request.params

  if (!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid repositorie ID' })
  }

  return next()
}

const validateRepositorieLikes = (request, response, next) => {
  const { likes } = request.body

  if (likes || likes === 0) {
      return response.status(400)
        .json({ error: 'Invalid update likes' })
  }

  return next()
}

const validateRepositorieUpdate = (request, response, next) => {
  const { likes } = request.body

  if (likes || likes === 0) {
      return response.status(400)
        .json({ error: 'Invalid update repositorie' })
  }

  return next()
}

app.use('/repositories/:id', validateRepositorieId)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", validateRepositorieLikes, (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = { 
    id: uuid(), 
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", validateRepositorieUpdate, (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositorieIndex = repositories
    .findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) {
      return response
          .status(400)
          .json({ error: 'Repositorie not found.' })
  }

  const repositorie = { 
    id, 
    title,
    url,
    techs
  }

  repositories[repositorieIndex] = {
    ...repositories[repositorieIndex],
    ...repositorie
  }

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorietIndex = repositories
    .findIndex(repositorie => repositorie.id === id)

  if (repositorietIndex < 0) {
      return response
          .status(400)
          .json({ error: 'Repositorie not found.' })
  }

  repositories.splice(repositorietIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories
    .findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) {
      return response
          .status(400)
          .json({ error: 'Repositorie not found.' })
  }

  repositories[repositorieIndex]['likes'] = repositories[repositorieIndex]['likes']+1

  return response.json(repositories[repositorieIndex])
});

module.exports = app;
