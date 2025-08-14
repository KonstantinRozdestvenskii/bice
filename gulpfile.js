'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const log = require('fancy-log'); // Для красивого вывода ошибок
const colors = require('ansi-colors'); // Для цветного вывода

// Обработка JS: объединение → минификация
function compileJs() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/inputmask/dist/jquery.inputmask.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/wowjs/dist/wow.js',
        'src/scripts/*.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(terser({
            keep_fnames: false,
            mangle: true
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/js'));
}

// Обработка LESS: компиляция → минификация
function compileLess() {
    return src('src/styles/style.less')
        .pipe(less().on('error', function(err) {
            // Выводим понятное сообщение об ошибке
            log.error(colors.red('LESS Error:'), err.message);
            this.emit('end'); // Позволяет Gulp продолжить работу после ошибки
        }))
        .pipe(dest('dist/css'))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'))
        .on('end', () => {
            log(colors.green('LESS compiled successfully!'));
        });
}

function copySlickFonts() {
    return src('node_modules/slick-carousel/slick/fonts/*')
        .pipe(dest('dist/fonts')); // Путь должен соответствовать тому, куда складываются стили
}

function copyMainFonts() {
    return src('src/fonts/*')
        .pipe(dest('dist/fonts')); // Путь должен соответствовать тому, куда складываются стили
}


// Слежение за изменениями
function watchFiles() {
    watch('src/scripts/**/*.js', series(compileJs));
    watch('src/styles/**/*.less', series(compileLess));
}

// Задачи для ручного запуска
exports.js = compileJs;
exports.less = compileLess;
exports.watch = watchFiles;

// Задача по умолчанию: параллельная сборка JS и LESS
exports.default = parallel(compileJs, compileLess, copySlickFonts, copyMainFonts);