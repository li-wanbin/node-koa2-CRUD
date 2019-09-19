const fs = require('fs')

const KEY_LEN = 1024;
const KEY_COUNT = 2048;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.+-*/(){}[]?~!@#$%^&_~';

let arr = [];

for (let i = 0; i < KEY_COUNT; i++) {
    let key = '';
    for (let j = 0; j < KEY_LEN; j++) {
        key += CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    arr.push(key);
}

fs.writeFileSync('.key', arr.join('\n'));
console.log(`Generated ${KEY_COUNT} keys.`)