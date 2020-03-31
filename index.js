const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.get("/", (req, res) => {
  res.json({
    text: "Apiworks"
  });
});

app.get("/api/login", (req, res) => {
  const user = { id: 3 };
  const token = jwt.sign({ user }, "my_secret_token");
  res.json({ token });
});

//antes de entrar a /api/protected, se ejecuta un middleware
//para asesurar que el token esté creado
app.get("/api/protected", ensureToken, (req, res) => {
  jwt.verify(req.token, "my_secret_key", (err, data) => {
    if (err) {
      console.dir(err);
      res.sendStatus(403);
    } else {
      res.json({ text: "protected", data });
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});
