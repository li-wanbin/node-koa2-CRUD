const adminCRUD = require('./../../libs/adminCRUD');

module.exports = adminCRUD(
    [
        { name: 'title', type: 'text', title: '标题' },
        { name: 'catalog_id', type: 'select', title: '分类', from: 'SELECT id,title FROM catalog_table' },
        { name: 'created_time', type: 'date', title: '时间' },
        { name: 'author', type: 'text', title: '作者' },
        { name: 'view', type: 'number', title: '阅读数' },
        { name: 'comment', type: 'number', title: '评价数' },
        { name: 'summary', type: 'text', title: '摘要' },
        { name: 'list_img_src', type: 'file', title: '列表图片' },
        { name: 'banner_img_src', type: 'file', title: 'banner' },
        { name: 'content', type: 'textarea', title: '内容' }
    ],
    'article',
    'article_table'
);