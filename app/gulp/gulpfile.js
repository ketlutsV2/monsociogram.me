const { src, dest, watch, parallel } = require("gulp");
//const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const scss = require("gulp-dart-scss");
const uglifycss = require('gulp-uglifycss');
const cleanCSS = require('gulp-clean-css');

//sass.compiler = require('sass');

function generateJS(cb) {
return src('../assets/scripts/**/*.js', { allowEmpty: true }) 
         //.pipe(uglify())
         .pipe(concat('sociogram.js'))
         .pipe(dest('../public'));
         cb();
}
exports.generateJS = generateJS;

function generateCSS(cb) {


return src("../assets/css/sociogram.scss")
       .pipe(
      scss({
        // Optional option object - See below or sass for API
      })) 
       .pipe(cleanCSS({compatibility: 'ie8'}))
       .pipe(uglifycss())     
   .pipe(concat('sociogram.css'))
  .pipe(dest("../public"))

cb();
}
exports.generateCSS = generateCSS;





function watchFiles(cb) {
    watch('../assets/scripts/**/*.js', generateJS);
    watch('../assets/css/**/*.scss', generateCSS);
    cb();
}

exports.watch = watchFiles;