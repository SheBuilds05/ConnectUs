const BASE = 'http://localhost:5000/api/admin';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getUsers = async () => {
  const res = await fetch(`${BASE}/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const getRunners = async () => {
  const res = await fetch(`${BASE}/runners`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch runners');
  return res.json();
};

export const getAllActivity = async () => {
  const res = await fetch(`${BASE}/activity`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch activity');
  return res.json();
};

export const blockEntity = async (type: 'user' | 'runner', id: string | number, block: boolean) => {
  const res = await fetch(`${BASE}/${type}s/${id}/block`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ blocked: block })
  });
  if (!res.ok) throw new Error('Action failed');
  return res.json();
};

export const fineEntity = async (type: 'user' | 'runner', id: string | number, amount: number, reason: string) => {
  const res = await fetch(`${BASE}/${type}s/${id}/fine`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ amount, reason })
  });
  if (!res.ok) throw new Error('Fine failed');
  return res.json();
};

export const removeEntity = async (type: 'user' | 'runner', id: string | number) => {
  const res = await fetch(`${BASE}/${type}s/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Remove failed');
  return res.json();
};