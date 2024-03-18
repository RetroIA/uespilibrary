import path from 'path'
const axios = require('axios');
const qs = require('querystring');
import User from '../model/User';

function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

function serveProtectedPage(pagePath) {
  return function (req, res, next) {
    if (req.session && req.session.userId) {
      res.sendFile(path.join(__dirname, pagePath));
    } else {
      res.redirect('/login');
    }
  };
}

function servePage(pagePath) {
  return function (req, res) {
    res.sendFile(path.join(__dirname, pagePath));
  };
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    res.redirect('/dashboard');
  } else {
    next();
  }
}


async function requireMod(req, res, next) {
  if (req.session && req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && user.moderador) {
      next();
    } else {
      res.redirect('/home');
    }
  } else {
    res.status(401).send('Por favor, faça login para acessar esta rota.');
  }
}

module.exports = { requireLogin, serveProtectedPage, servePage, redirectIfLoggedIn, requireMod };