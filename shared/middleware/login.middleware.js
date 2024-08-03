
export function youShallNotPass(req, res, next) {
    console.log('[BookMW] req received; body: ', req.body);
      if (!req.session.accId || !req.session.loginName) {
        console.log('[BooksMW] access denied');
        res.json({info: 'fail', detail: {summary: 'Access Denied', message: 'you are not logged in!'}}); //.status(401)
    } else {
      next();
    }
}
//user loged in mw -> change last login
//user logs out mw -> change last logout
