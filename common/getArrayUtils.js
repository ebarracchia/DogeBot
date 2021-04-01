module.exports = function getText(args) {
    let text = "";
    args.forEach(arg => {
        text += arg;
    });
    return text;
}