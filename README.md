# Phonebook Backend

A simple RESTful backend built with Node.js and Express for storing and managing phonebook contacts. Built as part of the Full Stack Open course, Part 3.

🔗 **Live app:** https://phone-book-backend-y87m.onrender.com/

## Features

- View all phonebook contacts
- Add a new contact
- Delete a contact
- Update an existing contact's number
- View phonebook info page

## API Endpoints

| Method | Endpoint            | Description                     |
|--------|----------------------|----------------------------------|
| GET    | `/api/persons`       | Get all contacts                |
| GET    | `/api/persons/:id`   | Get a single contact by id      |
| POST   | `/api/persons`       | Add a new contact               |
| PUT    | `/api/persons/:id`   | Update a contact's number       |
| DELETE | `/api/persons/:id`   | Delete a contact                |
| GET    | `/info`              | Shows number of entries + time  |

## Tech Stack

- Node.js
- Express
- React (frontend, served as static build)

## Running Locally

```bash
npm install
npm start
```

Server runs on `http://localhost:3001` by default.

## Deployment

Deployed on [Render](https://render.com). Frontend is built with `npm run build` and served statically by Express from the `dist` folder, so both frontend and backend run on the same origin in production.
