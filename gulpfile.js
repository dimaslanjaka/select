const { src, dest, parallel } = require('gulp');
const pug = require('gulp-pug');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
var sass = require('gulp-sass');

sass.compiler = require('node-sass');

function html() {
  return src('client/templates/*.pug')
    .pipe(pug())
    .pipe(dest('build/html'))
}

function css() {
  return src('src/select.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('dist/select.min.css'))
}

function js() {
  return src('src/select.js', { sourcemaps: true })
    .pipe(concat('select.min.js'))
    .pipe(dest('dist', { sourcemaps: true }))
}

exports.js = js;
exports.css = css;
//exports.html = html;
exports.default = parallel(css,js);//parallel(html, css, js);