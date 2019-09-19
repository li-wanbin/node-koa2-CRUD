const adminCRUD = require('./../../libs/adminCRUD');

//配置参数
let fields = [
    { name: 'title', type: 'text', title: '标题' }
]
let type = 'catalog';
let table = 'catalog_table';

module.exports = adminCRUD(fields, type, table);
