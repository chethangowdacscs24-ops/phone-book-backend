# Phonebook Backend

Express backend for the phonebook application. This service stores contacts in MongoDB and supports CRUD operations for phonebook entries.

## Requirements

- Node.js 18+
- MongoDB connection string
- `backend/.env` file containing `MONGODB_URI`

## Setup

Install dependencies:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=<your mongodb connection string>
PORT=3001
```

## Run locally

Start the server:

```bash
npm start
```

The backend listens on `http://localhost:3001` by default.

## Build and serve the frontend from backend

To build the React app and copy it into `backend/dist`:

```bash
npm run build:ui
```

Then run:

```bash
npm start
```

## API Endpoints

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/api/persons`     | Get all contacts               |
| GET    | `/api/persons/:id` | Get a single contact by id     |
| POST   | `/api/persons`     | Add a new contact              |
| PUT    | `/api/persons/:id` | Update a contact's number      |
| DELETE | `/api/persons/:id` | Delete a contact               |
| GET    | `/info`            | Shows number of entries + time |

## Notes

- Backend serves static files from `dist` if the frontend is built into that folder.
- The API model is defined in `backend/modules/person.js` and uses Mongoose.
- `npm run deploy:full` runs `build:ui`, stages files, commits with message `uibuild`, and pushes to the current repo branch.
