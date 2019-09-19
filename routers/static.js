const static = require('koa-static');

module.exports = function (router, options) {
    options.html = options.html || 3;
    options.img = options.img || 5;
    options.script = options.script || 1;
    options.styles = options.styles || 2;

    router.all(/((\.html)|(\.htm))/i, static('./static', {
        maxAge: options.html * 86400 * 1000
    }))
    router.all(/(\.css)/i, static('./static', {
        maxAge: options.styles * 86400 * 1000
    }))
    router.all(/((\.jpg)|(\.png)|(\.gif)|(\.svg))/i, static('./static', {
        maxAge: options.img * 86400 * 1000
    }))
    router.all(/((\.js)|(\.jsp))/i, static('./static', {
        maxAge: options.script * 86400 * 1000
    }))
    router.all('*', static('./static', {
        maxAge: 7 * 86400 * 1000
    }))
}