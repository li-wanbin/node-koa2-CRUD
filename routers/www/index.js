const Router = require('koa-router');
const path = require('path');
const fs = require('await-fs');
const common = require('../../libs/common');

let router = new Router();

router.get('/', async ctx => {
    let { HTTP_ROOT } = ctx.config;
    //获取数据并排序ASC表示升序
    let banners = await ctx.db.query(`SELECT * FROM banner_table ORDER BY serial ASC`);
    let catalog = await ctx.db.query(`SELECT * FROM catalog_table ORDER BY id ASC LIMIT 5`);
    let article = await ctx.db.query(`SELECT * FROM article_table LEFT JOIN catalog_table ON article_table.catalog_id=catalog_table.id ORDER BY article_table.created_time DESC LIMIT 10`);

    await ctx.render('www/index', {
        banners,
        catalog,
        HTTP_ROOT,
        article
    })
})
module.exports = router.routes();