/**
 * 
 * 
 * 

/**Response Interface
 * 
export const enum ResponseCodes {
    success = 'success',
    fail = 'fail'
}
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
ServerError.summary {
??? -> not logged in maybe access denied
Not created -> DB Error
}
*/
