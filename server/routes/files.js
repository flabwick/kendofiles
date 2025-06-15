const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/files
router.get('/', async (req, res) => {
  const { folder_id, extension } = req.query;
  let query = 'SELECT * FROM files';
  const clauses = [];
  const params = [];
  if (folder_id) {
    params.push(folder_id);
    clauses.push(`folder_id = $${params.length}`);
  }
  if (extension) {
    params.push(extension);
    clauses.push(`extension = $${params.length}`);
  }
  if (clauses.length) {
    query += ' WHERE ' + clauses.join(' AND ');
  }
  query += ' ORDER BY name';
  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// GET /api/files/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM files WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.sendStatus(404);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

// POST /api/files
router.post('/', async (req, res) => {
  const { name, folder_id, mime_type, size, content } = req.body;
  const extension = name.split('.').pop();
  try {
    const result = await db.query(
      'INSERT INTO files(name, folder_id, extension, mime_type, size, content) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, folder_id, extension, mime_type, size, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// PUT /api/files/:id
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const extension = name.split('.').pop();
  try {
    await db.query('UPDATE files SET name=$1, extension=$2, date_modified=NOW() WHERE id=$3', [name, extension, req.params.id]);
    const result = await db.query('SELECT * FROM files WHERE id=$1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// DELETE /api/files/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM files WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
