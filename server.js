const Koa = require('koa');
const Router = require('koa-router');
const static = require('./routers/static');
const body = require('koa-better-body');
const session = require('koa-session');
const fs = require('fs');
const ejs = require('koa-ejs');
const path = require('path');
const config = require('./config');


let server = new Koa();
server.listen(config.PORT);
console.log(`端口：${config.PORT}`);

//中间件
server.use(body({
    uploadDir: './static/upload',
}))
server.keys = fs.readFileSync('.key').toString().split('\n');
server.use(session({
    maxAge: 10 * 60 * 1000,
    renew: true
}, server))

//数据库
server.context.db = require('./libs/db');
server.context.config = config;

//路由和static
let router = new Router();

//统一错误处理
router.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.throw(500, 'Internal Server Error.');
    }
})


router.use('/admin', require('./routers/admin'));
router.use('', require('./routers/www'));
static(router, {
    html: 10,
    img: 20
})

//渲染
ejs(server, {
    root: path.resolve(__dirname, 'template'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
})

server.use(router.routes());

