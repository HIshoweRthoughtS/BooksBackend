
export function youShallNotPass(req, res, next) {
    console.log('[MWLogin] auth req received\n\taccid: ',req.session.accId,'\n\taccname: ',req.session.loginname);
      if (!req.session.accId || !req.session.loginname) {
        res.json({info: 'fail', detail: {summary: '???', message: 'Access Denied!'}}); //.status(401)
    } else {
      next();
    }
}
//user loged in mw -> change last login
//user logs out mw -> change last logout
