// console.log("hello backend");
require("dotenv").config();
const express = require("express");
const Person = require("./modules/person");
const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.end("hello world");
});
app.get("/api/persons", async (request, response) => {
  try {
    const result = await Person.find({});
    response.json(result);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});
app.get("/info", async (request, response) => {
  const now = new Date();
  const l = await Person.countDocuments({});
  response.send(`The PHONEBOOK has info of ${l} people<br/>${now.toString()}`);
});
app.get("/api/persons/:id", async (request, response) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: "Person not found" });
    }
  } catch (err) {
    console.log(err.message)
    response.status(400).json({ error: "invalid id" });
  }
});
app.put("/api/persons/:id", async (request, response) => {
  const body = request.body;
  try {
    const updatedContact = await Person.findByIdAndUpdate(
      request.params.id,
      {
        name: body.name,
        number: body.number,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContact) {
      return response.status(404).json({ error: "Person not found" });
    }

    response.json(updatedContact);
  } catch (error) {
    console.log(err.message)
    response.status(400).json({ error: error.message });
  }
});
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }
  const savedContact = new Person({
    name: body.name,
    number: body.number,
  });
  savedContact
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      response.status(500).json({ error: err.message });
    });
});
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "not found" });
      }
    })
    .catch((err) => {
      response.status(400).json({ error: err.message });
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
