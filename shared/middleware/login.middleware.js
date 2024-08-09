
export function youShallNotPass(req, res, next) {
    console.log('[MWLog] req received;');
    console.log('[LoginCheck] body: ', req.body);
      if (!req.session.accId || !req.session.loginname) {
        console.log('[LoginCheck] access denied');
        res.json({info: 'fail', detail: {summary: '???', message: 'Access Denied!'}}); //.status(401)
    } else {
      next();
    }
}
//user loged in mw -> change last login
//user logs out mw -> change last logout
