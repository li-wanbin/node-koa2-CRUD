const Router = require('koa-router');
const path = require('path');
const fs = require('await-fs');
const common = require('../../libs/common');

let router = new Router();

router.get('/login', async ctx => {
    await ctx.render('admin/login', {
        title: '登录',
        HTTP_ROOT: ctx.config.HTTP_ROOT,
        error_msg: ctx.query.error_msg
    });
})

router.post('/login', async ctx => {
    let { HTTP_ROOT } = ctx.config;
    let { username, password } = ctx.request.fields;
    let admins = JSON.parse(await fs.readFile(path.resolve(__dirname, '../../admins.json')));

    function findAdmin(user) {
        let x = null;
        admins.forEach(admin => {
            if (admin.username === user) {
                x = admin
            }
        });
        return x;
    }

    if (!findAdmin(username)) {
        //用户不存在
        ctx.redirect(`${HTTP_ROOT}/admin/login?error_msg=${encodeURIComponent('用户不存在')}`)
    } else if (findAdmin(username).password != common.md5(password + ctx.config.M)) {
        //密码错误
        ctx.redirect(`${HTTP_ROOT}/admin/login?error_msg=${encodeURIComponent('密码错误')}`)
    } else {
        //登陆成功
        ctx.session['admin'] = username;
        ctx.redirect(`${HTTP_ROOT}/admin/banner`)
    }
})

router.all('*', async (ctx, next) => {
    let { HTTP_ROOT } = ctx.config;
    if (ctx.session['admin']) {
        await next();
    } else {
        ctx.redirect(`${HTTP_ROOT}/admin/login`);
    }
})

router.get('/',async ctx=>{
    let { HTTP_ROOT } = ctx.config;
    ctx.redirect(`${HTTP_ROOT}/admin/banner`)
})

//----------------------------------------------------------------
//子路由

router.use('/banner',require('./banner'))
router.use('/article',require('./article'))
router.use('/catalog',require('./catalog'))

//---------------------------------------

module.exports = router.routes();