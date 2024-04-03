// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create an instance of express
const app = express();
const PORT = process.env.PORT || 3000

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const notesApi = require('./api/notes');

app.get('/api/notes', notesApi.getNotes);
app.post('/api/notes', notesApi.addNote);
app.delete('/api/notes/:id', notesApi.deleteNote);

// API Route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }
    res.json(JSON.parse(data));
  });
});

// API Route to add a new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Note title and text are required.' });
  }

  const newNote = { title, text, id: uuidv4() };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error writing new note' });
      }
      res.json(newNote);
    });
  });
});

// API Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes data' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error deleting note' });
      }
      res.json({ message: 'Deleted successfully' });
    });
  });
});

// HTML Route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// HTML Route to serve the index.html file as the default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on the designated port
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
