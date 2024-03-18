const express = require('express');
const routes = require('./routes/routes.js');
import mongoose from 'mongoose';
import session from 'express-session';
import fs from 'fs'; 
import path from 'path';
const bodyParser = require('body-parser'); 

class App {
    constructor() {
        mongoose.connect('mongodb+srv://cyberdevaster:LFdnD6DHWIks995d@cluster0.5nzxgnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        this.server = express();
        this.middlewares();
        this.routes();
    };
    middlewares() {
        this.server.use('/assets', express.static(path.join(__dirname, 'front/assets')));
        this.server.use(express.json());
        this.server.use(session({
            secret: 'cunamata', 
            resave: false,
            saveUninitialized: true,
            cookie: { 
                secure: false,
                maxAge: 30 * 60 * 1000 
            }
        }));        
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(express.urlencoded({ extended: true }));
    };
    routes() {
        this.server.use(routes);
    };
};

module.exports = new App().server;