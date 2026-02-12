import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import less from 'gulp-less';
import gulpCssbeautify from 'gulp-cssbeautify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import {deleteAsync} from 'del';

const sass = gulpSass(dartSass);
const paths = {
  styles: {
    src: '../sass/*.scss',
    dest: '../../dist/gulp'
  }
};

export const clean = await deleteAsync(['../../dist/gulp'], {force: true});

export function sassAll() {
	return gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(less())
		.pipe(gulpCssbeautify())
		.pipe(gulp.dest(paths.styles.dest));
}

export function sassSelect2(){
	return gulp.src('../sass/select2/core.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpCssbeautify())
		.pipe(rename('select2-custom.css'))
		.pipe(gulp.dest(paths.styles.dest));
}


export function sassProd() {
	return gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(less())
		.pipe(cleanCSS())	
		.pipe(rename({
			basename: 'main',
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.styles.dest));
}

export function sassWatch() {
	gulp.watch(paths.styles.src, sassDev);
}

//gulp task
gulp.task('sass', sassAll);
gulp.task('select2', sassSelect2);


gulp.task("all",gulp.series("sass", "select2"));





