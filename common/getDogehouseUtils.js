const isPromise = require('./getPromiseUtils.js');

module.exports = async function getUser(user) {
    if (isPromise(user)) {
        await user.then(resp => {
            if (resp.op == 'fetch_done')
                user = resp.d;
            }).catch(err => console.log(err));
    }
    return user;
}
