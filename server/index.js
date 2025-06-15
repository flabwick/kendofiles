const express = require('express');
const bodyParser = require('body-parser');

const folders = require('./routes/folders');
const files = require('./routes/files');
const operations = require('./routes/operations');

const app = express();
app.use(bodyParser.json());

app.use('/api/folders', folders);
app.use('/api/files', files);
app.use('/api/operations', operations);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
