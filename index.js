// console.log("hello backend");
const cors = require('cors');
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/", (req, res) => {
  res.end("hello world");
});
app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/api/info", (req, res) => {
  const now = new Date();
  res.send(
    `The PHONEBOOK has info of ${persons.length} people<br/>${now.toString()}`,
  );
});
app.get("/api/persons/:id", (req, res) => {
  const pid = req.params.id;
  const p = persons.find((n) => n.id == pid);
  if (!p) {
    return res.status(400).json({ error: "not found that " });
  }
  res.json(p);
});
app.delete("/api/persons/:id", (req, res) => {
  const pid = req.params.id;
  const p = persons.find((n) => n.id == pid);
  if (!p) {
    console.log("not found that id to delete");
    return res.status(400).json({ error: "not found" });
  }
  res.status(200).end();
  console.log(`phonebook of id ${pid} deleted successfully`);
  persons = persons.filter((n) => n.id !== pid);
});
const generateId = () => {
  return Math.floor(Math.random() * 10000000).toString();
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).json({ error: "name and number are required" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.status(201).json(person);
});
const port = process.env.PORT || 3001;
app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});
