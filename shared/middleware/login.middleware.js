import { Logger } from "../services/logger.service.js";

export function youShallNotPass(req, res, next) {
    const logger = Logger.getLogger();
    logger.add(`AccId: ${req.session.accId}`, 1, 'login middleware');
    logger.add(`AccName: ${req.session.loginname}`, 1, 'login middleware');
      if (!req.session.accId || !req.session.loginname) {
        res.json({info: 'fail', detail: {summary: '???', message: 'Access Denied!'}}); //.status(401)
    } 
    else {
      next();
    }
}
//user loged in mw -> change last login
//user logs out mw -> change last logout
