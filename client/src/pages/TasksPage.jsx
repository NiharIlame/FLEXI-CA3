import { useEffect, useMemo, useState } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '../services/taskService';

const emptyForm = {
  title: '',
  description: '',
  subject: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortMode, setSortMode] = useState('deadline');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const normalized = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || task.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    return normalized.sort((a, b) => {
      if (sortMode === 'deadline') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortMode === 'priority') {
        const levels = { high: 3, medium: 2, low: 1 };
        return levels[b.priority] - levels[a.priority];
      }
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
  }, [tasks, search, statusFilter, priorityFilter, sortMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateTask(editingId, form);
      } else {
        await createTask(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Unable to save task.');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      subject: task.subject,
      priority: task.priority,
      status: task.status,
      dueDate: new Date(task.dueDate).toISOString().slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Could not delete task.');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Could not update task status.');
    }
  };

  return (
    <div>
      <div className="header-row">
        <div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Task management</div>
          <h2 style={{ margin: '8px 0 0' }}>Your academic tasks</h2>
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
            <div className="form-group">
              <label>Due date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
          </div>

          <div className="toolbar">
            <button type="submit" className="primary-btn">{editingId ? 'Save Task' : 'Add Task'}</button>
            {editingId && (
              <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <div className="card">
        <div className="toolbar">
          <input className="search-box" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks or subjects" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="deadline">Sort by deadline</option>
            <option value="priority">Sort by priority</option>
            <option value="updated">Sort by updated</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">No tasks match your filters yet.</div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-top">
                  <div>
                    <h3 style={{ margin: '0 0 8px' }}>{task.title}</h3>
                    <div style={{ color: '#64748b' }}>{task.subject}</div>
                  </div>
                  <div className="task-actions">
                    <span className={`tag priority-${task.priority}`}>{task.priority}</span>
                    <span className={`tag status-${task.status}`}>{task.status}</span>
                  </div>
                </div>

                <p style={{ color: '#475569', margin: '16px 0' }}>{task.description || 'No description provided.'}</p>

                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '14px' }}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>

                <div className="task-actions">
                  <button type="button" className="small-btn primary" onClick={() => handleEdit(task)}>Edit</button>
                  <button type="button" className="small-btn" onClick={() => handleStatusUpdate(task._id, task.status === 'completed' ? 'pending' : 'completed')}>
                    {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button type="button" className="small-btn danger" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
