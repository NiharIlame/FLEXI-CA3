import api from './api';

export const getAllTasks = async () => {
  const response = await api.get('/tasks');
  return response.data.tasks || [];
};

export const createTask = async (data) => {
  const response = await api.post('/tasks', data);
  return response.data.task;
};

export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.task;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data.task;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
