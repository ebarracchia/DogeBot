/**
 * Determine whether the given `promise` is a Promise.
 *
 * @param {*} promise
 *
 * @returns {Boolean}
 */
 module.exports = function isPromise(promise) {  
    return !!promise && typeof promise.then === 'function'
}