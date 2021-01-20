const express = require('express');
const bcrypt = require('bcrypt');
const serviceUser = require('../models/model_service/user_service');
const authMdws = require('../middlewares/auth.mdws');

module.exports = function(app) {
  app.use('/news', authMdws.auth, require('../routes/news.route'));
  app.use('/opportunities', authMdws.auth, require('../routes/oppor.route'));
  app.use('/forum', authMdws.auth, require('../routes/forum.route'));

  //Only Admin, mod Permission can access - but for testing purpose, disabled
  app.use('/mod', authMdws.filterLowerMod, require('../routes/mod/mod.route'));
  app.use('/admin', authMdws.filterNonAdmin, require('../routes/mod/admin.route'));

  // app.use('/mod', require('../routes/mod/mod.route'));
  // app.use('/admin', require('../routes/mod/admin.route'));

  app.use('/c', authMdws.auth, require('../routes/content.route'));
  app.use('/u', authMdws.auth, require('../routes/sn.route'));
  app.use('/p', express.static('./public'));



  //Xử lý LOGIN-LOGOUT------------------------------------------------

  app.get('/', authMdws.filterAuthed, function (req, res) {
    let err = (+req.query.err) || 0;  //For displaying err messages
    let message = [
      'no err',
      `Username doesn't exist`,
      `Wrong password`
    ];

    if (err < 0 || err >= message.length) {
      err = 0;
    }    

    res.render('login', {
      layout: false,
      message: (err == 0)?null:message[err]
    });
  });
  app.post('/', authMdws.filterAuthed, async function(req, res) {
    //console.log(req.body);
    const posted = {
      Username: req.body.username,
      Password: req.body.password
    }
    const user = await serviceUser.singleByUsername(posted.Username);
    if (user === null) {
      //username not exists
      res.redirect('/?err=1');
      return;
    }

    const ret = bcrypt.compareSync(posted.Password, user.HashPassword);
    if (!ret) {
      //wrong password
      res.redirect('/?err=2');
      return;
    }

    delete user.HashPassword;
    req.session.isAuth = true;
    req.session.authUser = user;

    //console.log(user);

    let url = req.session.retUrl || '/news';

    res.redirect(url);
  });
  app.get('/logout', function (req, res) {
    req.session.isAuth = false;
    req.session.authUser = null;
    res.redirect('/');
  });
}