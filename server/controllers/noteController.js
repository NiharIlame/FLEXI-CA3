const Note = require('../models/Note');

const createNote = async (req, res) => {
  try {
    const { title, content, subject } = req.body;

    if (!title || !content || !subject) {
      return res.status(400).json({ message: 'Title, content, and subject are required.' });
    }

    const note = await Note.create({
      title,
      content,
      subject,
      user: req.user._id,
    });

    return res.status(201).json({ message: 'Note created successfully.', note });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while creating note.', error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notes.', error: error.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    return res.status(200).json({ note });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching note.', error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    const allowedFields = ['title', 'content', 'subject'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) note[field] = req.body[field];
    });

    note.updatedAt = Date.now();
    await note.save();

    return res.status(200).json({ message: 'Note updated successfully.', note });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating note.', error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    return res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting note.', error: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
