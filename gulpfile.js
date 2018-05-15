/*eslint-env node*/

var gulp            = require('gulp');
//var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var eslint          = require('gulp-eslint');
//don't use jasmine until handlebars.js > 2.0.0 installed
//var jasmine		= require('gulp-jasmine-phantom');
var concat			= require('gulp-concat');
//var uglify			= require('gulp-uglify');  //currently a security issue
var browserSync     = require('browser-sync').create();
//var babel			= require('gulp-babel');
//var sourcemaps		= require('gulp-sourcemaps');
var imagemin		= require('gulp-imagemin');
var watch  			= require('gulp-watch');


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//uncomment only one of the below lines depending
//on use of css or sass
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//also comment/uncomment sass/css watchers

//gulp.task('serve', ['sass','js','html'], function() {
gulp.task('serve', ['css','js','html','root'], function() {
	browserSync.init({
		server: './dist'
	});

	//gulp.watch('./sass/*.scss', ['sass']);
	gulp.watch('./js/**/*.js',['js']);
	gulp.watch('./*.js',['root']);
	gulp.watch('./*.html',['html']);
	gulp.watch('./css/**/*.css',['css']);
	gulp.watch('./dist/*.html').on('change',browserSync.reload);

	// consider this to have brosersync wait until copy is done to
	// reload - not needed at the moment
	// gulp.watch('./*.html',['html','proc-watch']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	return gulp.src('./sass/*.scss')
		.pipe(sourcemaps.init())
		//.pipe(sass({outputSyle: 'compressed'}).on('error',sass.logError))
		.pipe(sass().on('error',sass.logError))
		.pipe(autoprefixer({
			//browsers: ['since 2010']
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('css', function() {
	return gulp.src('./css/**/*.css')
		.pipe(autoprefixer({
			//browsers: ['since 2010']
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

//transpile js files and auto-inject into browsers
gulp.task('js', function() {
	return gulp.src('./js/**/*.js')
		//.pipe(sourcemaps.init())
		//.pipe(babel())
		//.pipe(concat('all.js'))
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());
});

// task to minimize js prior to publication
// must run manually
gulp.task('js-dist', function() {
	return gulp.src('js/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
	return gulp.src('./*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('root', function() {
	return gulp.src('./sw.js')
		.pipe(gulp.dest('./dist'));
});

gulp.task('img', function() {
	return watch('./img/**/*', function() {
		gulp.src('./img/**/*')
			.pipe(imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.jpegtran({progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(gulp.dest('./dist/img'))
			.pipe(browserSync.stream());
	});
});

gulp.task('lint', () => {
	return gulp.src(['./js/*.js','!node_modules/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

//default task to start server and watch files
gulp.task('default', ['serve', 'img']);