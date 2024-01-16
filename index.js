import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todolist",
    password: "ankit",
    port: 5433,
});

let todoItems = [];

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const items = await db.query("SELECT * FROM todo ORDER BY id;");
        res.render("index.ejs", { items: items.rows });
        /* db.end(); */
    } catch (err) {
        console.error(err);
    }
});

app.post("/work", async (req, res) => {
    if (req.body.operation === "delete") {
        try {
            await db.query("DELETE FROM todo WHERE id = $1;", [req.body.id]);
        } catch (err) {
            console.error(err);
        }
    } else {
        try {
            console.log(req.body.id);
            await db.query("UPDATE todo SET content = $1 WHERE id = $2;", [req.body.todo, req.body.id]);
        } catch (err) {
            console.error(err);
        }
    }
    res.redirect("/");
});

app.post("/create", async (req, res) => {
    try {
        const items = await db.query("INSERT INTO todo (content) VALUES ($1);", [req.body.item]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
});

app.listen(port, () => {
    console.log(`Server Started at localhost:${port}`);
});