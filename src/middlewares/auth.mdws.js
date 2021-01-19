const Permission = {
  'Admin': 4,
  'Mod': 3,
};
//Admin can only be in /admin, teacher can only be in /teacher
const userRoute = {
  'Admin': '/admin',
  'Mod': '/mod',
  'Else': '/news',
};

module.exports = {
  //Normal auth for anything that need it
  auth: function(req, res, next) {
    if (req.session.isAuth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/');
    }

    next();
  },
  //Block already logged in user from accessing next()
  filterAuthed: function(req, res, next) {
    if (req.session.isAuth === true) {
      //Block logged in user
      if (req.session.authUser.Permission === Permission['Admin']) {
        res.redirect(userRoute['Admin']);
      }
      else if (req.session.authUser.Permission === Permission['Mod']) {
        res.redirect(userRoute['Mod']);
      }
      else {
        //console.log('else');
        res.redirect(userRoute['Else'])
      }
      
      return;
    }

    next();
  },
  //Block non admin user from accessing user from accessing next()
  filterNonAdmin: function(req, res, next) {
    if (req.session.isAuth === true) {
      //Block logged in user
      if (req.session.authUser.Permission === Permission['Admin']) {
        next();
      }
      else if (req.session.authUser.Permission === Permission['Mod']) {
        res.redirect(userRoute['Mod']);
      }
      else {
        //console.log('else');
        res.redirect(userRoute['Else'])
      }
      
      return;
    }

    res.redirect('/');    
  },
  //Block lower permission user than mod from accessing next()
  filterLowerMod: function(req, res, next) {
    if (req.session.isAuth === true) {
      //Block logged in user
      if (req.session.authUser.Permission >= Permission['Mod']) {
        next();
      }
      else {
        //console.log('else');
        res.redirect(userRoute['Else'])
      }
      
      return;
    }

    res.redirect('/');    
  },
}