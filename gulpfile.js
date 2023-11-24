const path = require('path')
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const edge = import('edge.js');

// Edge.jsのテンプレートファイルのパス
const edgeTemplatesPath = '/test/gulp/edge';

// Edge.jsのコンパイルタスク
gulp.task("edge", function() {
  edge.configure({ 
    // Edge.jsの設定（必要に応じて）
  });

  return gulp
    .src(`${edgeTemplatesPath}/**/*.edge`)
    .pipe(edge()) // Edge.jsのコンパイルを実行
    .pipe(gulp.dest('dist')); // コンパイル結果を保存するディレクトリ
});

// Sassのコンパイルタスク
gulp.task("styles", function() {
  return gulp
    .src("css/style.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      })
    )
    .pipe(gulp.dest("dist"));
});

// ウォッチャータスク
gulp.task("watch", function() {
  gulp.watch("css/style.scss", gulp.series("styles"));
  gulp.watch(`${edgeTemplatesPath}/**/*.edge`, gulp.series("edge"));
});

// "dev" タスクを追加
gulp.task("dev", gulp.series("styles", "edge", "watch"));

// デフォルトタスク
gulp.task("default", gulp.series("styles", "edge", "watch"));
