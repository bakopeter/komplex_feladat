const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;
const lodash = require('lodash');

// Middleware-ek beállítása
app.use(cors());
app.use(bodyParser.json());