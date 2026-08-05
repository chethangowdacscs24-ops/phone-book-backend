// console.log("hello backend");
require("dotenv").config();
const express = require("express");
const Person = require("./modules/person");
const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use((request , response , next)=>{
  console.log(request.body)
  next();

})

app.get("/", (req, res) => {
  res.end("hello world");
});

app.get("/api/persons", async (request, response, next) => {
  try {
    const result = await Person.find({});
    response.json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/info", async (request, response, next) => {
  const now = new Date();
  try{
    const l = await Person.countDocuments({});
    response.send(`The PHONEBOOK has info of ${l} people<br/>${now.toString()}`);
  }
  catch(error){
    console.log(error);
    next(error)
  }

});

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
     return response.json(person);
    } else {
     return response.status(404).json({ error: "Person not found" });
    }
  } catch (err) {
    console.log(error);
    next(error)
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
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
    console.log(error);
    next(error)
  }
});

app.post("/api/persons", (request, response, next) => {
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
    .catch((error) => {
      console.log(error);
    next(error)
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "not found" });
      }
    })
    .catch((error) => {
      console.log(error);
    next(error)
    });
});
const unknownEndPoint=(request, response) =>{
  response.status(400).json({error: "unknow endpoint plz check url"})
  return;
};
app.use(unknownEndPoint);

const errorHandler=(error, request, response, next)=>{
  if(error.message=== 'CastError'){
    return response.status(400).json({error: "malfactured id"})
  }
  next();
}
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
