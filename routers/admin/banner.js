const adminCRUD = require('./../../libs/adminCRUD');

let fields = [
    { name: 'title', type: 'text', title: '标题' },
    { name: 'src', type: 'file', title: '图片' },
    { name: 'href', type: 'text', title: '链接' },
    { name: 'serial', type: 'number', title: '排序' }
]
let type = 'banner';
let table = 'banner_table';

module.exports = adminCRUD(fields, type, table);
