const express = require("express");
const YAML = require("yaml");
const path = require("path");
const opener = require("opener");
const ejs = require("ejs");
const app = express();
const fs = require("fs");

const gamesRootFolder = path.join(process.cwd(), "games");
console.log("current working dir: " + process.cwd());
const gamesFolderNamesRegex = /^(?<templateName>.*?)_(?<gameName>.*)$/;

app.use(
  "/public/reveal.js",
  express.static(path.join(__dirname, "node_modules/reveal.js"))
);

app.get("/", function (req, res) {
  //scan games folder
  const gameFolders = fs
    .readdirSync(gamesRootFolder)
    .filter((templateFileName) => {
      return (
        fs
          .statSync(path.join(gamesRootFolder, templateFileName))
          .isDirectory() && templateFileName.match(gamesFolderNamesRegex)
      );
    });

  const games = [];
  gameFolders.forEach((gamesFolderName) => {
    games.push({
      template: gamesFolderName.match(gamesFolderNamesRegex)[1],
      name: gamesFolderName.match(gamesFolderNamesRegex)[2],
      fullPath: path.join(gamesRootFolder, gamesFolderName),
    });
  });

  console.log(gameFolders);
  console.log(games);

  ejs.renderFile(
    path.join(__dirname, "index.html.ejs"),
    { games, path, YAML, fs},
    {},
    function (err, str) {
      console.log(err);
      // console.log(str)
      res.send(str);
    }
  );
});

// auto available port, cf. https://stackoverflow.com/a/54464386
const server = app.listen(0, () => {
  console.log("Listening on port:", server.address().port);
  opener(`http://localhost:${server.address().port}`);
});

//https://github.com/vercel/pkg/issues/245
