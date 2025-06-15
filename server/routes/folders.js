const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/folders
router.get('/', async (req, res) => {
  const { parent_id, path } = req.query;
  try {
    let result;
    if (parent_id) {
      result = await db.query('SELECT * FROM folders WHERE parent_id = $1 ORDER BY name', [parent_id]);
    } else if (path) {
      result = await db.query('SELECT * FROM folders WHERE path = $1', [path]);
    } else {
      result = await db.query('SELECT * FROM folders ORDER BY id');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// GET /api/folders/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM folders WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.sendStatus(404);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch folder' });
  }
});

// GET /api/folders/:id/contents
router.get('/:id/contents', async (req, res) => {
  try {
    const folders = await db.query('SELECT * FROM folders WHERE parent_id = $1 ORDER BY name', [req.params.id]);
    const files = await db.query('SELECT * FROM files WHERE folder_id = $1 ORDER BY name', [req.params.id]);
    res.json({ folders: folders.rows, files: files.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
});

// POST /api/folders
router.post('/', async (req, res) => {
  const { name, parent_id } = req.body;
  try {
    let parentPath = '';
    if (parent_id) {
      const parent = await db.query('SELECT path FROM folders WHERE id = $1', [parent_id]);
      if (parent.rowCount) parentPath = parent.rows[0].path;
    }
    const path = parentPath ? `${parentPath}/${name}` : name;
    const result = await db.query(
      'INSERT INTO folders(name, parent_id, path, is_root) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, parent_id || null, path, !parent_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// PUT /api/folders/:id
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const folder = await db.query('SELECT * FROM folders WHERE id = $1', [req.params.id]);
    if (!folder.rowCount) return res.sendStatus(404);
    const oldPath = folder.rows[0].path;
    const parentId = folder.rows[0].parent_id;
    let parentPath = '';
    if (parentId) {
      const p = await db.query('SELECT path FROM folders WHERE id = $1', [parentId]);
      if (p.rowCount) parentPath = p.rows[0].path;
    }
    const newPath = parentPath ? `${parentPath}/${name}` : name;
    await db.query('UPDATE folders SET name=$1, path=$2, date_modified=NOW() WHERE id=$3', [name, newPath, req.params.id]);
    await db.query(
      "UPDATE folders SET path = $1 || substring(path from length($2)+1) WHERE path LIKE $3 || '/%'",
      [newPath, oldPath, oldPath]
    );
    await db.query(
      "UPDATE files SET path = $1 || substring(path from length($2)+1) WHERE folder_id IN (SELECT id FROM folders WHERE path LIKE $3 || '/%')",
      [newPath, oldPath, oldPath]
    );
    const result = await db.query('SELECT * FROM folders WHERE id=$1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// DELETE /api/folders/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM folders WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

module.exports = router;
