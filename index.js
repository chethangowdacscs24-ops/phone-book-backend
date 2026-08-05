// console.log("hello backend");
require("dotenv").config();
const express = require("express");
const Person = require("./modules/person");
const app = express();
app.use(express.json());
app.use(express.static("dist"));

app.use((request, response, next) => {
  console.log(`\n[HTTP] ${request.method} ${request.path}`);
  console.log("[HTTP] query =>", JSON.stringify(request.query));
  console.log("[HTTP] body  =>", JSON.stringify(request.body));
  next();
});

app.get("/", (req, res) => {
  console.log("[ROUTE] GET / replying with hello world");
  res.end("hello world");
});

app.get("/api/persons", async (request, response, next) => {
  console.log("[ROUTE] GET /api/persons start");
  try {
    const result = await Person.find({});
    console.log(`[ROUTE] GET /api/persons success (${result.length} people)`);
    response.json(result);
  } catch (error) {
    console.error("[ROUTE] GET /api/persons error", error);
    next(error);
  }
});

app.get("/info", async (request, response, next) => {
  const now = new Date();
  console.log("[ROUTE] GET /info start");
  try {
    const l = await Person.countDocuments({});
    console.log(`[ROUTE] GET /info success count=${l}`);
    response.send(
      `The PHONEBOOK has info of ${l} people<br/>${now.toString()}`,
    );
  } catch (error) {
    console.error("[ROUTE] GET /info error", error);
    next(error);
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
  console.log(`[ROUTE] GET /api/persons/${request.params.id} start`);
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      console.log("[ROUTE] GET /api/persons/:id found person");
      return response.json(person);
    } else {
      console.warn("[ROUTE] GET /api/persons/:id person not found");
      return response.status(404).json({ error: "Person not found" });
    }
  } catch (error) {
    console.error("[ROUTE] GET /api/persons/:id error", error);
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const body = request.body;
  console.log(`[ROUTE] PUT /api/persons/${request.params.id} start`, body);
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
      console.warn("[ROUTE] PUT /api/persons/:id person not found");
      return response.status(404).json({ error: "Person not found" });
    }

    console.log("[ROUTE] PUT /api/persons/:id success", updatedContact);
    response.json(updatedContact);
  } catch (error) {
    console.error("[ROUTE] PUT /api/persons/:id error", error);
    next(error);
  }
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  console.log("[ROUTE] POST /api/persons start", body);

  if (!body.name) {
    console.warn("[ROUTE] POST /api/persons validation failed: missing name");
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    console.warn("[ROUTE] POST /api/persons validation failed: missing number");
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
      console.log("[ROUTE] POST /api/persons success", result);
      response.json(result);
    })
    .catch((error) => {
      console.error("[ROUTE] POST /api/persons error", error);
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  console.log(`[ROUTE] DELETE /api/persons/${request.params.id} start`);
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        console.log("[ROUTE] DELETE /api/persons/:id deleted");
        response.status(204).end();
      } else {
        console.warn("[ROUTE] DELETE /api/persons/:id not found");
        response.status(404).json({ error: "not found" });
      }
    })
    .catch((error) => {
      console.error("[ROUTE] DELETE /api/persons/:id error", error);
      next(error);
    });
});
const unknownEndPoint = (request, response) => {
  response.status(400).json({ error: "unknow endpoint plz check url" });
  return;
};
app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  console.error("[ERROR HANDLER]", {
    message: error.message,
    name: error.name,
    path: request.path,
    body: request.body,
    params: request.params,
    query: request.query,
  });

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformed id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "ReferenceError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
