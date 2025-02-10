const fs = require("fs");
const fetch = require("node-fetch");
const http = require("http");
const url = require("url");

fetch("https://dummyjson.com/users")
  .then((response) => response.json())
  .then((data) => {
    fs.writeFileSync("users.json", JSON.stringify(data.users, null, 2));
    console.log("Data written to users.json");
  })
  .catch((error) => console.error("Error fetching data:", error));

// 2)
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === "/users") {
    if (fs.existsSync("users.json")) {
      let users = JSON.parse(fs.readFileSync("users.json"));

      // 3)
      if (query.age) {
        users = users.filter((user) => user.age == query.age);
      }
      if (query.gender) {
        users = users.filter(
          (user) => user.gender.toLowerCase() === query.gender.toLowerCase()
        );
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "users.json not found" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
