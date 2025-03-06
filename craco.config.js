const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    webpack: {
        alias: {
            '@': resolve('src'),
            '@components': resolve('src/components'),
            '@pages': resolve('src/pages'),
            '@model': resolve('src/model'),
            '@utils': resolve('src/utils'),
        }
    },
};