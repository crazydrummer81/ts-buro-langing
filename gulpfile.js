// const autoPrefixer = require('gulp-autoprefixer');
// const svgsprite = require('gulp-svg-sprite');
// const svgSprite = require('gulp-svg-sprite');
//! Все файлы поректа автоматом не удаляются, всё, что удаляется - в константе path.clean
//! При изменении папки iconsprite запустить: gulp svgSprite
// const project_folder = require("path").basename(__dirname).replace(".loc", "");
const project_folder = "dist";
const source_folder = "#src";
const fs = require('fs');

const path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
		php: project_folder + "/ajax/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,webp,ico}",
		fonts: source_folder + "/fonts/*.{ttf,woff,woff2}",
		php: source_folder + "/ajax/*.php"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,webp,ico}",
		php: source_folder + "/**/*.php",
	},
	clean: [
		"./" + project_folder + "/css",
		"./" + project_folder + "/js",
		"./" + project_folder + "/fonts",
		"./" + project_folder + "/img/*.*",
		"./" + project_folder + "/ajax/*.*"
	]
}

const { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html'),
	webpcss = require("gulp-webpcss"),
	svgSprite = require("gulp-svg-sprite"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require('gulp-fonter');

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}
function php() {
	return src(path.src.php)
		.pipe(fileinclude())
		.pipe(dest(path.build.php))
		.pipe(browsersync.stream())
}
function css() {
	return src(path.src.css)
		.pipe(scss({
			outputStyle: "expanded"
		}))
		.pipe(webpcss({
		}))
		.pipe(group_media())
		.pipe(
			autoprefixer({
				overrideBrowserlist: ["last 5 versions"],
				cascade: true
			})
		)

		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}
function img() {
	return src(path.src.img)
		.pipe(webp({
			quality: 70
		}))
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			optimizationLevel: 3
		}))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

//! svgSprite Запускается вручную: gulp svgSprite для соединения svg в один файл. Если нужно автоматизировать, можно сделать как остальное
//* Результат и примеры использования смотреть в dist/img/stack
// function svgSprite() {
// 	return src(source_folder + '/iconsprite/*.svg')
// 		.pipe(svgSprite({
// 			mode: {
// 				stack: {
// 					sprite: "../icons/icons.svg",
// 					example: true
// 				}
// 			},
// 		}))
// 		.pipe(dest(path.build.img))
// 		.pipe(browsersync.stream())
// }
//* Сборка единого SVG-файла. Запускается вручную.
gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../icons/icons.svg",
					example: true
				}
			},
		}))
		.pipe(dest(path.build.img));
})

//! Конвертируем шрифты otf в ttf внутри исходной папки. Запускается вручную
gulp.task('otf2ttf', function () {
	return gulp.src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'));
})

function fonts(params) {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

function fontsStyle(params) {

	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() {

}

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], img);
	gulp.watch([path.watch.php], php);
}
function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, php, img, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

// exports.svgSprite = svgSprite;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.php = php;
exports.build = build;
exports.watch = watch;
exports.default = watch;