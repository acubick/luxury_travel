const {
	src,
	dest,
	watch,
	parallel,
	series
} = require('gulp')
const del = require('del')
const gulpPug = require('gulp-pug')
const fileInclude = require('gulp-file-include')
const gulpSass = require('gulp-sass')(require('sass'))
const gulpPlumber = require('gulp-plumber')
const gulpRename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const cheerio = require('gulp-cheerio')
const replace = require('gulp-replace')
const concat = require('gulp-concat')
const gulpif = require('gulp-if')
const gulpnotify = require('gulp-notify')

let isBuildFlag = false


// function pug2html(){
//   return src('dev/pug/pages/*.pug')
//     .pipe(gulpPlumber())
//     .pipe(gulpPug({
//                     pretty: true
//                   }))
//     .pipe(gulpPlumber.stop())
//     .pipe(dest('dist/'))
// }

function cleanFolder() {
	return del('dist')
}

function fonts() {
	return src(['dev/static/fonts/**/*.*'])
		.pipe(dest('dist/static/fonts/'))
}


function htmlInclude() {
	return src(['dev/index.html'])
		.pipe(gulpPlumber())
		.pipe(fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulpRename({
			basename: 'index',
			extname: '.html'
		}))
		.pipe(gulpPlumber.stop())
		.pipe(browserSync.stream())
		.pipe(dest('dist/'))
	// .pipe(browserSync.stream())
}


function scss2css() {
	return src('dev/static/styles/styles.scss')
		.pipe(gulpPlumber())
		.pipe(gulpSass({
			outputStyle: 'compressed'
	}).on('error', gulpnotify.onError()))
		.pipe(cleanCSS({
			options: {
				level: 2
			}
		}))
		.pipe(autoprefixer())
		.pipe(gulpPlumber.stop())
		.pipe(browserSync.stream())
		.pipe(dest('dist/static/css/'))

}

function script() {
	return src('dev/static/js/main.js')
		.pipe(gulpPlumber())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulpif(isBuildFlag, uglify()))
		.pipe(gulpPlumber.stop())
		.pipe(browserSync.stream())
		.pipe(dest('dist/static/js/'))

}

function vendors() {
	return src([
			'./node_modules/svg4everybody/dist/svg4everybody.min.js',
			'./node_modules/slick-carousel/slick/slick.min.js'
		])
		.pipe(gulpPlumber())
		.pipe(concat('libs.js'))
		.pipe(gulpPlumber.stop())
		.pipe(dest('dist/static/js/vendors/'))

}

function copyLibs() {
	return src(['./node_modules/jquery/dist/jquery.min.js'])
		.pipe(dest('dist/static/js/vendors/'))
}


function copyFavicons() {
	return src(['./dev/static/icons/*.*'])
		.pipe(dest('dist/static/icons/'))
}


function imageMin() {
	return src(
			'dev/static/images/**/*.{jpg,gif,png,svg}',
			'!dev/static/images/sprite/*'
		)
		.pipe(imagemin([
			imagemin.gifsicle({
				interlaced: true
			}),
			imagemin.mozjpeg({
				quality: 75,
				progressive: true
			}),
			imagemin.optipng({
				optimizationLevel: 5
			}),
			imagemin.svgo({
				plugins: [{
						removeViewBox: true
					},
					{
						cleanupIDs: false
					}
				]
			})
		]))
		.pipe(dest('dist/static/images/'))

}


function svgSpriteBuild() {
	return src('dev/static/images/sprite/*.svg')
		// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill')
				$('[stroke]').removeAttr('stroke')
				$('[style]').removeAttr('style')
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: 'sprite.svg'
				}
			}
		}))
		.pipe(dest('dist/static/images/sprite/'))
}

function setMode(isBuild) {
	return cb => {
		isBuildFlag = isBuild
		cb()
	}
}

function watchingFiles() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false,
		open: false
	})
	watch('dev/*.html', htmlInclude)
	watch('dev/static/styles/**/*.scss', scss2css)
	watch('[dev/static/images/**/*.{jpg,gif,png,svg}, !dev/static/images/sprite/*.svg]', imageMin)
	watch('dev/static/images/sprite/*', svgSpriteBuild)
	watch('dev/static/js/main.js', script)
	watch('dist/*.html').on('change', browserSync.reload)
}

const dev = parallel(fonts, htmlInclude, scss2css, imageMin, svgSpriteBuild, vendors, script, copyLibs, copyFavicons)

exports.default = series(cleanFolder, dev, watchingFiles)
exports.build = series(cleanFolder, setMode(true), dev)