// ** Initialize Module
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulpConcat = require('gulp-concat');
const gulpPostcss = require('gulp-postcss');
const gulpReplace = require('gulp-replace');
const gulpSass = require('gulp-sass');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpUglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// ** File path variable
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    imgPath: 'app/img/**/*.*',
};

// ** Sass Task
function scssTask() {
    return src(files.scssPath)
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass())
        .pipe(gulpPostcss([autoprefixer(), cssnano()]))
        .pipe(gulpSourcemaps.write('.'))
        .pipe(dest('dist/css'));
}

// ** Js Task
function jsTask() {
    return src(files.jsPath)
        .pipe(gulpConcat('all.js'))
        .pipe(gulpUglify())
        .pipe(terser())
        .pipe(dest('dist/js'));
}

// ** Image Optimize Task
function imgTask() {
    return src(files.imgPath).pipe(imagemin()).pipe(dest('dist/images'));
}

// ** Cachebusting Task
const cbString = new Date().getTime();
function cacheBustTask() {
    return src(['index.html'])
        .pipe(gulpReplace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// ** Watch Task
function watchTask() {
    watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

// ** Default Task
exports.default = series(parallel(scssTask, jsTask), imgTask, cacheBustTask, watchTask);

// ! ****************Sass & server************************
// ** Sass Task
function sass() {
    return src('src/scss/**/*.scss', { sourcemaps: true })
        .pipe(gulpSass())
        .pipe(gulpPostcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist/css'));
}

// ** Js Task
function js() {
    return src('src/js/**/*.js', { sourcemaps: true })
        .pipe(gulpUglify())
        .pipe(terser())
        .pipe(dest('dist/js'));
}
// ** Browser Sync [liveServer] Task
function liveServer(cb) {
    browserSync.init({
        server: {
            baseDir: '.',
        },
    });
    cb();
}

// ** Browser Sync [liveReload] Task
function liveReload(cb) {
    browserSync.reload();
    cb();
}

// ** Browser Sync [liveReload] Task
function seenAll(cb) {
    watch('*.html', liveReload);
    watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(sass, js, liveReload));
}
// ! ****************Sass & server************************

// ** Default Task
exports.live = series(sass, js, liveServer, seenAll);

// Npm Install Packages
// npm i --save-dev postcss gulp gulp-sass gulp-sourcemaps gulp-terser gulp-postcss autoprefixer cssnano gulp-concat gulp-uglify gulp-replace gulp-imagemin browser-sync
// npm i postcss
