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
*/
