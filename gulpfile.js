import path from 'path';
import gulp from 'gulp';
import sass from 'sass';
import ejs from 'ejs';
import rename from 'gulp-rename';
import tap from 'gulp-tap';
import fs from 'fs';
import htmlmin from 'gulp-htmlmin';

// Sass -> CSS
function styles() {
  return gulp.src('src/css/**/*.scss')
    .pipe(tap(file => {
      const contents = sass.renderSync({ file: file.path, outputStyle: 'expanded' }).css;
      file.contents = Buffer.from(contents);
    }))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('dist/css'));
}

// EJS テンプレート -> HTML
function templates() {
  const data = fs.existsSync('src/template/data.json')
    ? JSON.parse(fs.readFileSync('src/template/data.json', 'utf8'))
    : {};

  fs.existsSync('src/template/helpers.js') && require('./src/template/helpers.js');

  return gulp.src('src/template/**/*.ejs')
    .pipe(tap(file => {
      const contents = ejs.render(String(file.contents), data);
      file.contents = Buffer.from(contents);
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true })) // HTML ミニファイ
    .pipe(gulp.dest('dist'));
}

// タスク登録
gulp.task('styles', styles);
gulp.task('templates', templates);

// dev タスク
gulp.task('dev', gulp.series('styles', 'templates'));

// デフォルトタスク
gulp.task('default', gulp.series('styles', 'templates'));
