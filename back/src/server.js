const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const server = http.Server(app);

mongoose.connect('mongodb+srv://optInOut:optInOut@optinout.0yjik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);

const porta = process.env.PORT || 8081;

server.listen(porta);