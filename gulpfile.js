const gulp = require('gulp')
const gulpif = require('gulp-if')
const flatten = require('gulp-flatten')
const argv = require('minimist')(process.argv.slice(2))
const env = argv.env ? argv.env : 'development'
const output = {
    development: './tmp',
    production: './dist',
    netlify: './netlify',
}
const outputNetlify = `${output[env]}/words`
const browserSync = require('browser-sync').create()

// CSS
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')

const sassOptions = {
    development: {
        errLogToConsole: true,
        outputStyle: 'expanded',
    },
    production: {
        errLogToConsole: false,
        outputStyle: 'compressed',
    },
    netlify: {
        errLogToConsole: false,
        outputStyle: 'compressed',
    },
}

gulp.task('styles', () => {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass(sassOptions[env]).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(flatten())
        .pipe(gulp.dest(`${output[env]}/css`))
        .pipe(gulpif(env === 'netlify', gulp.dest(`${outputNetlify}/css`)))
})

// JS
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')

gulp.task('scripts', () => {
    const b = browserify({
        entries: 'src/scripts/index.js',
        debug: false,
    })

    return b
        .transform(
            babelify.configure({
                presets: ['@babel/preset-env'],
                sourceMaps: env !== 'development',
            }),
        )
        .bundle()
        .pipe(source('scripts.js'))
        .pipe(gulpif(env !== 'development', buffer()))
        .pipe(gulpif(env !== 'development', uglify()))
        .pipe(flatten())
        .pipe(gulp.dest(`${output[env]}/js`))
        .pipe(gulpif(env === 'netlify', gulp.dest(`${outputNetlify}/js`)))
})

// Vendor
gulp.task('vendor-css', () => {
    return gulp
        .src([
            './src/styles/albert.min.css',
            './node_modules/tippy.js/dist/tippy.css',
        ])
        .pipe(gulp.dest(`${output[env]}/css`))
        .pipe(gulpif(env === 'netlify', gulp.dest(`${outputNetlify}/css`)))
})

// Service worker
gulp.task('sw', () => {
    const replace = require('gulp-replace')
    return gulp
        .src('./src/sw.js')
        .pipe(replace('{buildtime}', Date.now()))
        .pipe(gulp.dest(output[env]))
        .pipe(gulpif(env === 'netlify', gulp.dest(outputNetlify)))
})

// HTML
gulp.task('html', () => {
    return gulp.src(['./src/**/*.html', './src/site.webmanifest'])
        .pipe(gulp.dest(output[env]))
        .pipe(gulpif(env === 'netlify', gulp.dest(outputNetlify)))
})

// Build
gulp.task('build', gulp.parallel('styles', 'scripts', 'vendor-css', 'sw', 'html'))

// Reload browser
gulp.task('reload', (done) => {
    browserSync.reload()
    done()
})

// Browser sync
gulp.task('browserSync', () => {
    browserSync.init({
        port: 1236,
        server: './tmp',
    })
    gulp.watch(
        [
            'src/styles/**/*.scss',
            'src/scripts/**/*.js',
            'src/**/*.html',
            './src/sw.js',
        ],
        gulp.series('build', 'reload'),
    )
})

// Dev server
gulp.task('serve', gulp.series('build', 'browserSync'))
