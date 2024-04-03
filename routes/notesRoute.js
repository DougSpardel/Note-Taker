// notesRoutes.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// GET /api/notes - Return all notes
router.get('/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading notes data' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// POST /api/notes - Save a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Note title and text are required.' });
  }

  const newNote = { title, text, id: uuidv4() };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading notes data' });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error writing new note' });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

// DELETE /api/notes/:id - Delete a note
router.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading notes data' });
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== id);

      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error deleting note' });
        } else {
          res.json({ message: 'Deleted successfully' });
        }
      });
    }
  });
});

module.exports = router;
