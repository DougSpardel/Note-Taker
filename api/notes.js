const fs = require('fs');
const path = require('path');

// Path to your JSON file
//const dbPath = path.join(__dirname, '..', 'db', 'db.json');

// Read notes from JSON file
const getNotesFromFile = () => {
  try {
    const data = fs.readFileSync('./db/db.json');
    return JSON.parse(data);
  } catch (error) {
    // If there is an error reading the file, return an empty array
    console.error('Error reading from db.json:', error);
    return [];
  }
};

// Save notes to JSON file
const saveNotesToFile = (notes) => {
  try {
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

// GET /api/notes - Returns all notes
const getNotes = (req, res) => {
  const notes = getNotesFromFile();
  res.json(notes);
};

// POST /api/notes - Creates a new note
const addNote = (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ message: 'Title and text are required' });
  }

  const notes = getNotesFromFile();
  const newNote = {
    id: notes.length + 1, // Simple ID generation strategy
    title,
    text,
  };

  notes.push(newNote);
  saveNotesToFile(notes);
  res.status(201).json(newNote);
};

// DELETE /api/notes/:id - Deletes a note by id
const deleteNote = (req, res) => {
  const { id } = req.params;
  let notes = getNotesFromFile();
  const noteIndex = notes.findIndex(note => note.id.toString() === id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes = notes.filter(note => note.id.toString() !== id);
  saveNotesToFile(notes);
  res.status(204).send();
};

module.exports = { getNotes, addNote, deleteNote };
