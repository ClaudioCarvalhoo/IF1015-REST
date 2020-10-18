var Request = require("request");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Options:");
console.log("0: GET /");
console.log("1: GET /animes");
console.log("2: GET /animes/2267fc9e-1709-45b7-bf97-f584b93130f5");
console.log("3: GET /characters/e22f755c-b070-4157-a287-337d21dc362b");
console.log("4: POST /animes");
console.log("5: POST /characters");
console.log("6: PUT /animes/{id}/9a5a9866-e1ec-4f73-a5d9-af726b6121f5");
console.log("7: PUT /characters/{id}/471471c1-e93c-44f2-b319-ecbf5c6b8683");
console.log("8: DELETE /animes/c83ceab6-489e-4f9f-b9fa-6a1f322a27bc");
console.log("9: DELETE /characters/207de119-6ba0-4f90-9298-b24d7d49a476");

rl.on("line", (option) => {
  switch (option) {
    case "0":
      Request.get("http://localhost:7474/", (error, response, body) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.parse(response.body));
        }
      });
      break;
    case "1":
      Request.get("http://localhost:7474/animes", (error, response, body) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.parse(response.body));
        }
      });
      break;
    case "2":
      Request.get(
        "http://localhost:7474/animes/2267fc9e-1709-45b7-bf97-f584b93130f5",
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "3":
      Request.get(
        "http://localhost:7474/characters/e22f755c-b070-4157-a287-337d21dc362b",
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "4":
      Request.post(
        {
          headers: {
            "content-type": "application/json",
          },
          url: "http://localhost:7474/animes",
          body: JSON.stringify({
            name: "New anime",
            mainCharacters: [],
          }),
        },
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "5":
      Request.post(
        {
          headers: {
            "content-type": "application/json",
          },
          url: "http://localhost:7474/characters",
          body: JSON.stringify({
            name: "New character",
            voiceActor: "New voice actor name",
          }),
        },
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "6":
      Request.put(
        {
          headers: {
            "content-type": "application/json",
          },
          url:
            "http://localhost:7474/animes/9a5a9866-e1ec-4f73-a5d9-af726b6121f5",
          body: JSON.stringify({
            name: "New name",
            mainCharacters: [],
          }),
        },
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "7":
      Request.put(
        {
          headers: {
            "content-type": "application/json",
          },
          url:
            "http://localhost:7474/characters/471471c1-e93c-44f2-b319-ecbf5c6b8683",
          body: JSON.stringify({
            name: "New name",
            voiceActor: "New voice actor",
          }),
        },
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "8":
      Request.delete(
        "http://localhost:7474/animes/c83ceab6-489e-4f9f-b9fa-6a1f322a27bc",
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    case "9":
      Request.delete(
        "http://localhost:7474/animes/207de119-6ba0-4f90-9298-b24d7d49a476",
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(JSON.parse(response.body));
          }
        }
      );
      break;
    default:
      break;
  }
});
