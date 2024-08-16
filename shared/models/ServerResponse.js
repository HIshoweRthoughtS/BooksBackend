
/**Response Interface
 * 
interface ServerRes<T> {
    info: ResponseCodes,
    detail: T | ServerError
}
interface ServerError {
    summary: string,
    message: string,
    //more soon
}
*/
const ResponseInfo = {
    success: 'success',
    fail: 'fail'
}

class ServerResponse {
    constructor(info, data) {
        this.info = info;
        this.data = data;
    }
}
export class SuccessResponse extends ServerResponse {
    constructor(data) {
        super(ResponseInfo.success, data);
    }
}
export class FailResponse extends ServerResponse {
    constructor(error) {
        super(ResponseInfo.fail, error);
    }
}


/**const levels = {
  emerg: 'emerg',
  alert: 'alert',
  crit: 'crit',
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
};

const levelsNumbers = {
  [levels.emerg]: 0,
  [levels.alert]: 1,
  [levels.crit]: 2,
  [levels.error]: 3,
  [levels.warning]: 4,
  [levels.notice]: 5,
  [levels.info]: 6,
  [levels.debug]: 7,
}; */