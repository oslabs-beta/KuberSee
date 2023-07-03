const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.resolve(__dirname, '../build')));

app.listen(PORT, () => { console.log('Listening on port 3000... kubersee application') });