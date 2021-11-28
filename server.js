const express = require('express');
const path = require('path');
const db = require('./db/db.json ');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));   

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) =>
  console.log(db),
  res.status(200).json(db)
),

app.post('/api/notes', (req, res) => {

    const {title, text} = req.body;

    if (title && text) {
        const Notes = {
            title,
            text,
            id: uuidv4()
        }

        db.push(Notes)
        const arrStr = JSON.stringify(db, null, 2)
        
        fs.writeFile('./db/db.json', arrStr, (err) =>
        err
            ? console.error(err)
            : console.log('new note succesfully created')
        );

        const response = {
            status: 'success',
            body: Notes,
        };

        res.status(200).json(response);
    } else{
        res.status(500).json('Something went wrong with posting new note');
    }
});

app.listen(PORT, () => 
  console.log(`App listening on: ${PORT}`)
)