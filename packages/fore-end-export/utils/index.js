
export function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
export function isFunction(value) {
    return getType(value)==='function'?true:false;
}