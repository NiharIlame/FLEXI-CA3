import { useEffect, useMemo, useState } from 'react';
import { createNote, deleteNote, getAllNotes, updateNote } from '../services/noteService';

const emptyForm = {
  title: '',
  content: '',
  subject: '',
};

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || 'Unable to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const query = search.toLowerCase();
      return note.title.toLowerCase().includes(query) || note.subject.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
    });
  }, [notes, search]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateNote(editingId, form);
      } else {
        await createNote(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      setError(err.message || 'Could not save note.');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content, subject: note.subject });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      setError(err.message || 'Could not delete note.');
    }
  };

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</div>
          <h2 style={{ margin: '8px 0 0' }}>Study notes</h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows="5" required />
          </div>

          <div className="toolbar">
            <button type="submit" className="primary-btn">{editingId ? 'Save Note' : 'Add Note'}</button>
            {editingId && (
              <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <div className="card">
        <div className="toolbar">
          <input className="search-box" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes" />
        </div>

        {loading ? (
          <div className="empty-state">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">No notes available yet.</div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-top">
                  <div>
                    <h3 style={{ margin: '0 0 8px' }}>{note.title}</h3>
                    <div style={{ color: '#64748b' }}>{note.subject}</div>
                  </div>
                </div>
                <p style={{ margin: '16px 0', color: '#475569', whiteSpace: 'pre-line' }}>{note.content}</p>
                <div className="note-actions">
                  <button type="button" className="small-btn primary" onClick={() => handleEdit(note)}>Edit</button>
                  <button type="button" className="small-btn danger" onClick={() => handleDelete(note._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
