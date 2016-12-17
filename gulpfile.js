const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
    gulp.src('src/**/*.js')
    .pipe(babel({
        presets: ['stage-3']
    }))
    .pipe(gulp.dest('build'));
});

/*  */
let watcher = gulp.watch('src/**/*.js', ['default']);
watcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
