var gulp = require('gulp');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');

gulp.task('less', function () {
	gulp.src('public/css/less/style.less')
    	.pipe(less())
    	.pipe(gulp.dest('public/css'));
    gulp.src('public/css/less/viewer.less')
    	.pipe(less())
    	.pipe(gulp.dest('public/css'));
});

gulp.task('start', function () {
  nodemon({
    script: 'app.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('default', function() {
	gulp.run('less');
	gulp.start('start')
  	var watchLess = gulp.watch('public/css/less/*.less', ['less']);
});