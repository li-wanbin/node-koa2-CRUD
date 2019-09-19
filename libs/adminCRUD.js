const Router = require('koa-router');
const path = require('path');
const common = require('./common');

module.exports = function (fields, type, table) {
    let router = new Router();
    let page_types = [
        { title: 'banner管理', type: 'banner' },
        { title: '文章分类', type: 'catalog' },
        { title: '文章管理', type: 'article' }
    ];
    router.get('/', async ctx => {
        let { HTTP_ROOT } = ctx.config
        let datas = await ctx.db.query(`SELECT * FROM ${table} ORDER BY id ASC`);

        fields.forEach(async field => {
            if (field.type == 'select') {
                field.items = await ctx.db.query(field.from);
            }
        })
        await ctx.render(`admin/table`, {
            HTTP_ROOT,
            datas,
            fields,
            page_types,
            type
        })
    })
    //通用添加数据操作
    router.post('/', async ctx => {
        let { HTTP_ROOT } = ctx.config
        //处理数据
        let keys = [];
        let values = [];
        fields.forEach(field => {
            const { name, type } = field;
            keys.push(name);
            //文件单独处理
            if (type == 'file') {
                values.push(path.basename(ctx.request.fields[name][0].path));
            } else if (type == 'date') {
                values.push(new Date(ctx.request.fields[name]).getTime() / 1000)
            } else {
                values.push(ctx.request.fields[name]);
            }
        })
        //存入数据库
        await ctx.db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${keys.map(key => '?').join(',')})`, values)
        //重定向
        ctx.redirect(`${HTTP_ROOT}/admin/${type}`);
    })
    //通用删除数据操作
    router.get('/delete/:id', async ctx => {
        let { HTTP_ROOT, UPLOAD_DIR } = ctx.config;
        let { id } = ctx.params;
        //查询数据库是否存在这条数据
        let data = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
        //判断数据是否存在
        ctx.assert(data.length, 400, 'No data.')

        //删除对应文件
        let row = data[0];
        fields.forEach(async ({ name, type }) => {
            if (type == 'file') {
                await common.unlink(path.resolve(UPLOAD_DIR, row[name]));
            }
        })
        //删除数据库信息
        await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id]);
        //重定向
        ctx.redirect(`${HTTP_ROOT}/admin/${type}`);
    })
    //通用修改api接口
    router.get('/get/:id', async ctx => {
        let { id } = ctx.params;
        //查询数据库是否存在这条数据
        let rows = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
        if (rows.length == 0) {
            ctx.body = { err: 1, msg: 'No this data.' };
        } else {
            ctx.body = { err: 0, msg: 'success', data: rows[0] };
        }
    })
    //通用修改数据
    router.post('/modify/:id', async ctx => {
        const post = ctx.request.fields;
        let { HTTP_ROOT, UPLOAD_DIR } = ctx.config;
        let { id } = ctx.params;
        //获取原来的数据
        let rows = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
        ctx.assert(rows.length, 400, 'No this data.');
        //处理文件
        let paths = {};
        let keys = [];
        let values = [];
        let file_change = {};
        fields.forEach(({ name, type }) => {
            if (type == 'file') {
                paths[name] = rows[0][name];
                if (post[name] && post[name].length && post[name][0].size) {
                    file_change[name] = true;
                    keys.push(name);
                    values.push(path.basename(post[name][0].path));
                }
            } else if (type == 'date') {
                keys.push(name);
                values.push(new Date(post[name]).getTime() / 1000);
            } else {
                keys.push(name);
                values.push(post[name]);
            }
        })
        //处理数据
        await ctx.db.query(`UPDATE ${table} SET ${keys.map(key => (`${key}=?`)).join(',')} WHERE ID=?`, [...values, id]);

        fields.forEach(({ name, type }) => {
            if (type == 'file' && file_change[name]) {
                common.unlink(path.resolve(UPLOAD_DIR, paths[name]));
            }
        })
        ctx.redirect(`${HTTP_ROOT}/admin/${type}`);
    })

    return router.routes();
}
