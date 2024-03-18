const { Router } = require('express');
const { requireLogin, serveProtectedPage, servePage, redirectIfLoggedIn, requireMod } = require('./middlewares');

import crudUser from "../controller/UsersController"
import multer from 'multer';
import multerConfig from '../multerConfig';
import path from 'path';

const upload = multer(multerConfig);
const express = require('express');
const routes = new Router();

// Rotas relacionadas ao usuário
routes.get('/mostrarUsuarios', crudUser.showAll);
routes.get('/mostrarUsuario:id', crudUser.show);
routes.post('/cadastrarUsuario', crudUser.store);
routes.put('/atualizarUsuario', crudUser.update);
routes.delete('/deletarUsuario/:id' , crudUser.delete); 


//Rota de login: usuario
routes.post('/login', crudUser.login);
routes.get('/check-login', crudUser.checkLogin);
routes.get('/logout', crudUser.logout);
routes.get('/check-moderador', crudUser.checkModerador);
routes.put('/user/:id/tornar-moderador', crudUser.tornarModerador);

// Proteger de usuários logados
routes.get('/login', redirectIfLoggedIn, servePage('../front/pages/login.html'));
routes.get('/cadastro', redirectIfLoggedIn, servePage('../front/pages/cadastro.html'));

// Para usuarios não logados
routes.get('/', servePage('../front/pages/home.html')); 
routes.get('/cadastro', servePage('../front/pages/cadastro.html'));
routes.get('/base', servePage('../front/pages/base.html'));
routes.get('/categoria', servePage('../front/pages/categoria.html'));
routes.get('/emprestimo', servePage('../front/pages/emprestimo.html'));
routes.get('/login', servePage('../front/pages/login.html'));
routes.get('/livro', servePage('../front/pages/livro.html'));
routes.get('/usuarios', servePage('../front/pages/usuarios.html'));
routes.get('/administrador', servePage('../front/pages/home_administrador.html'));

//Só para usuários logados
//routes.get('/exemplo', requireLogin, serveProtectedPage('../front/pages/exemplo.html'));

//Rotas para os administradores do site
//routes.get('/moderador', requireLogin, requireMod, serveProtectedPage('../front/pages/exemplo.html'));

module.exports = routes;