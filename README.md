# Learn PostgreSQL with Node.js Express and Sequelize ORM

This is a basic setup for a Node.js Express server connected to PostgreSQL using Sequelize ORM.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up PostgreSQL database:
   - Create a database named `myapp` (or update the database name in `server.js`).

3. Update the database credentials in `server.js` if needed:
   - Default: user 'postgres', database 'myapp', password 'password'.

## Running the Server

```
npm start
```

The server will run on http://localhost:3000

## API Endpoints

- GET / : Hello message
- GET /users : Fetch all users
- POST /users : Add a new user (send JSON with name and email)

Example POST request:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```