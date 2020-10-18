const Express = require("express");
const xmlparser = require("express-xml-bodyparser");
let animes = require("./animes.json");
let characters = require("./characters.json");
const _ = require("lodash");
const uuid = require("uuid");
const xml = require("xml");
const { rest, flatten } = require("lodash");

const app = Express();
app.use(Express.json());
app.use(xmlparser());
app.use(Express.urlencoded({ extended: true }));
const port = 7474;
const API_URL = "https://localhost:7474";

class hateoas {
  constructor(type, href, rel) {
    this.type = type;
    this.href = API_URL + href;
    this.rel = rel;
  }
}

class dataAndBackToRootHateoas {
  constructor(data) {
    (this.data = data), (this.links = [new hateoas("GET", "", "start")]);
  }
}

const validateAnimeRequest = (body) => {
  if (
    _.isString(body.name) &&
    Array.isArray(body.mainCharacters) &&
    body.mainCharacters.every((charId) =>
      characters.map((char) => char.id).includes(charId)
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const validateCharacterRequest = (body) => {
  if (_.isString(body.name) && _.isString(body.voiceActor)) {
    return true;
  } else {
    return false;
  }
};

const mapCharacterToHateoas = (character) => {
  return {
    ...character,
    links: [
      new hateoas("GET", `/characters/${character.id}`, "character"),
      new hateoas("PUT", `/characters/${character.id}`, "character"),
      new hateoas("DELETE", `/characters/${character.id}`, "character"),
    ],
  };
};

const mapAnimeToHateoas = (anime) => {
  return {
    ...anime,
    mainCharacters: anime.mainCharacters.map((char) => ({
      id: char,
      links: [
        new hateoas("GET", `/characters/${char}`, "character"),
        new hateoas("PUT", `/characters/${char}`, "character"),
        new hateoas("DELETE", `/characters/${char}`, "character"),
      ],
    })),
    links: [
      new hateoas("GET", `/animes/${anime.id}`, "self"),
      new hateoas("PUT", `/animes/${anime.id}`, "self"),
      new hateoas("DELETE", `animes/${anime.id}`, "self"),
    ],
  };
};

app.get("/", (req, res) => {
  res.status(200).json({
    links: [
      new hateoas("GET", "", "self"),
      new hateoas("GET", "/anime", "anime"),
      new hateoas("POST", "/anime", "anime"),
      new hateoas("POST", "/character", "character"),
    ],
  });
});

app.get("/animes", (req, res) => {
  res
    .status(200)
    .json(
      new dataAndBackToRootHateoas(
        animes.map((anime) => mapAnimeToHateoas(anime))
      )
    );
});

app.get("/animes/:animeId", (req, res) => {
  let anime = animes.find((anime) => anime.id === req.params.animeId);
  if (anime) {
    res
      .status(200)
      .json(new dataAndBackToRootHateoas(mapAnimeToHateoas(anime)));
  } else {
    res.status(404).send();
  }
});

app.get("/characters/:characterId", (req, res) => {
  let character = characters.find(
    (character) => character.id === req.params.characterId
  );
  if (character) {
    res
      .status(200)
      .json(new dataAndBackToRootHateoas(mapCharacterToHateoas(character)));
  } else {
    res.status(404).send();
  }
});

app.post("/animes", (req, res) => {
  if (validateAnimeRequest(req.body)) {
    let id = uuid.v4();
    animes.push({
      id: id,
      name: req.body.name,
      mainCharacters: req.body.mainCharacters,
    });
    res.status(200).json(
      new dataAndBackToRootHateoas({
        id: id,
        links: [
          new hateoas("GET", `/animes/${id}`, "self"),
          new hateoas("PUT", `/animes/${id}`, "self"),
          new hateoas("DELETE", `/animes/${id}`, "self"),
        ],
      })
    );
  } else {
    res.status(400).send();
  }
});

app.post("/characters", (req, res) => {
  if (validateCharacterRequest(req.body)) {
    let id = uuid.v4();
    characters.push({
      id: id,
      name: req.body.name,
      voiceActor: req.body.voiceActor,
    });
    res.status(200).json(
      new dataAndBackToRootHateoas({
        id: id,
        links: [
          new hateoas("GET", `/characters/${id}`, "self"),
          new hateoas("PUT", `/characters/${id}`, "self"),
          new hateoas("DELETE", `/characters/${id}`, "self"),
        ],
      })
    );
  } else {
    res.status(400).send();
  }
});

app.put("/animes/:animeId", (req, res) => {
  if (validateAnimeRequest(req.body) && uuid.validate(req.params.animeId)) {
    let found = false;
    animes = animes.map((x) => {
      if (x.id == req.params.animeId) {
        found = true;
        return {
          id: req.params.animeId,
          name: req.body.name,
          mainCharacters: req.body.mainCharacters,
        };
      } else {
        return x;
      }
    });
    if (!found) {
      animes.push({
        id: req.params.animeId,
        name: req.body.name,
        mainCharacters: req.body.mainCharacters,
      });
    }
    res
      .status(200)
      .json(new dataAndBackToRootHateoas({ id: req.params.animeId }));
  } else {
    res.status(400).send();
  }
});

app.put("/characters/:characterId", (req, res) => {
  if (
    validateCharacterRequest(req.body) &&
    uuid.validate(req.params.characterId)
  ) {
    let found = false;
    characters = characters.map((x) => {
      if (x.id == req.params.characterId) {
        found = true;
        return {
          id: req.params.characterId,
          name: req.body.name,
          voiceActor: req.body.voiceActor,
        };
      } else {
        return x;
      }
    });
    if (!found) {
      characters.push({
        id: req.params.characterId,
        name: req.body.name,
        voiceActor: req.body.voiceActor,
      });
    }
    res
      .status(200)
      .json(new dataAndBackToRootHateoas({ id: req.params.characterId }));
  } else {
    res.status(400).send();
  }
});

app.delete("/animes/:animeId", (req, res) => {
  animes = animes.filter((anime) => anime.id != req.params.animeId);
  res.status(200).json(new dataAndBackToRootHateoas());
});

app.delete("/characters/:characterId", (req, res) => {
  characters = characters.filter(
    (character) => character.id != req.params.characterId
  );
  res.status(200).json(new dataAndBackToRootHateoas());
});

app.listen(port);
