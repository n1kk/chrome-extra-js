const path = require("path")
const resolve = (...p) => path.resolve(path.join(__dirname, path.join.apply(null, p)))

const pkg = require(resolve('package.json'))

const gulp = require('gulp');
const gulp_babel = require('gulp-babel');
const gulp_babili = require("gulp-babili");
const gulpif = require('gulp-if');
const gulp_rename = require("gulp-rename");
const gulp_sizereport = require('gulp-sizereport');
const gulp_filter = require('gulp-filter');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_rollup = require('gulp-rollup');
const gulp_better_rollup = require('gulp-better-rollup');
const gulp_print = require('gulp-print');

const rollup = require('rollup').rollup;
const rollup_babel = require('rollup-plugin-babel');
const rollup_nodeResolve = require('rollup-plugin-node-resolve');

const del = require('del');
const argv = require('yargs').argv;

const inputDir = resolve('src')
const outputDir = resolve('dist')

console.log(argv.prod)

const babelConfig = {
  presets: [
    'preact',
    /*["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }]*/
  ]
}

//----------------------------------------

gulp.task('clean', function () {
  return del([outputDir + '/**/*']);
});

//----------------------------------------

// gulp-rollup
gulp.task('compile:jsx:gulp-rollup', () => {
    return gulp.src('./src/!**!/!*.jsx')
      //.pipe(gulp_print())
      .pipe(gulpif(!argv.prod, gulp_sourcemaps.init()))
      .pipe(gulp_rollup({
        input: 'src/codeEdit.jsx',
        format: 'iife',
        plugins: [rollup_babel(babelConfig)],
        globals: {preact: 'preact'},
        external: ['preact'],
        impliedExtensions: ['.jsx']
      }))
      .pipe(gulpif(argv.prod, gulp_babili({mangle: {keepClassName: true}})))
      .pipe(gulpif(!argv.prod, gulp_sourcemaps.write('.')))
      .pipe(gulp.dest(outputDir))
  }
);

// gulp--better-rollup
gulp.task('compile:jsx:gulp--better-rollup', () => {
  return gulp.src('./src/codeEdit.jsx')
    //.pipe(gulp_print())
    .pipe(gulpif(!argv.prod, gulp_sourcemaps.init()))
    //.pipe(babel(babelConfig))
    .pipe(gulp_better_rollup({
      //external: ['preact'],
      plugins: [
        rollup_nodeResolve({ extensions: [ '.jsx'] }),
        rollup_babel(babelConfig),
      ]
    }, {
      format: 'iife',
      //globals: {preact: 'preact'},
    }))
    
    .pipe(gulpif(argv.prod, gulp_babili({mangle: {keepClassName: true}})))
    .pipe(gulp_rename({extname: ".js"}))
    .pipe(gulpif(!argv.prod, gulp_sourcemaps.write('.')))
    .pipe(gulp.dest(outputDir))
  }
);

// vanilla-rollup
gulp.task('compile:jsx:vanilla-rollup', function () {
  return rollup({
    input: './src/codeEdit.jsx',
    external: ['preact'],
    plugins: [
      rollup_babel(babelConfig),
      rollup_nodeResolve({ extensions: [ '.jsx'] }),
    ]
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      globals: {preact: 'preact'},
      file: './dist/codeEdit.js'
    });
  });
});

// -----------------------------------------------------------

gulp.task('copy:preact', () => {
    return gulp.src('./node_modules/preact/dist/preact.js')
      .pipe(gulp_babili({mangle: {keepClassName: true}}))
      .pipe(gulp.dest(outputDir))
  }
);


gulp.task('copy:ace', () => {
    return gulp.src('./node_modules/ace-builds/src-min/**/*')
      .pipe(gulp.dest(outputDir + '/ace'))
  }
);

gulp.task('copy:rest', () => {
    const filteredJS = gulp_filter(['src/**/*.js'], {restore: true});
    return gulp.src(['./src/*.{js,html,json}'])
      .pipe(filteredJS)
      .pipe(gulpif(!argv.prod, gulp_sourcemaps.init()))
      .pipe(gulpif(argv.prod, gulp_babili({mangle: {keepClassName: true}})))
      .pipe(gulpif(!argv.prod, gulp_sourcemaps.write('.')))
      .pipe(filteredJS.restore)
      .pipe(gulp.dest(outputDir))
  }
)

gulp.task('copy:assets', () => {
    return gulp.src(['./assets/**.*'])
      .pipe(gulp.dest(outputDir + '/assets'))
  }
)

gulp.task('sizereport', function () {
  return gulp.src(outputDir+'/**/*')
    .pipe(gulp_sizereport());
});

gulp.task('default', gulp.series('clean', 'compile:jsx:gulp--better-rollup', 'copy:rest', 'copy:ace', 'copy:assets'));

if (argv.watch)
  gulp.watch('src/**/*', gulp.series('default'));


