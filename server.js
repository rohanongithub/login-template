import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "server", "views"));
app.set("view engine", "ejs");

// Middleware to serve static files - this is just in case for countering errors :)
app.use(express.static(path.join(__dirname, "server", "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index", { state: false });
});

app.post("/signin", async (req, res) => {
  const userEnteredMail = req.body.email.trim();
  const userEnteredPassword = req.body.password.trim();

  try {
    // Using axios to fetch JSON file
    const response = await axios.get("http://localhost:3000/users.json");
    const users = response.data;

    const user = users.find(
      (user) =>
        user.email === userEnteredMail && user.password === userEnteredPassword
    );

    if (user) {
      res.render("agent-page");
    } else {
      res.render("index", { state: true });
    }
  } catch (error) {
    res.status(500).send("Server error.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
