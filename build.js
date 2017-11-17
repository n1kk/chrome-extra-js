'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const rollup = require('rollup');
const rollup_ts2 = require('rollup-plugin-typescript2');
const pkg = require('./package.json');
const filesize = require('filesize');
const text_table = require('text-table');
const rollup_noderesolve = require('rollup-plugin-node-resolve');

const baseConf = {
  format: 'es',
  ts_config: {
    tsconfigOverride: {
      compilerOptions: { target: 'ES2015' , module: "es2015", declaration: false, sourcemap: true }
    }
  },
}

const targets = [
  { parent: baseConf, input: 'background.ts' },
  { parent: baseConf, input: 'content.ts' },
  { parent: baseConf, input: 'popup.tsx' },
];

let promise = Promise.resolve();
const task = cb => promise = promise.then(cb)

// Clean up the output directory
task(() => del([`dist/*`]))

// merging with targets parent properties
const mergeTargetWithParent = target => !target.parent ? target : Object.assign({}, mergeTargetWithParent(target.parent), target)

// Compile source code into a distributable format
for (const conf of targets) {
  // TODO: why i did this ?
  let confs = [mergeTargetWithParent(conf)]
  confs.forEach(c => runBuild(c))
}

function runBuild(conf) {
  const name = conf.input && path.basename(conf.input, path.extname(conf.input))
  const input = `src/${conf.input||(pkg.name+'.js')}`
  const dest = conf.dest || `${conf.destDir||'dist'}/${conf.filename||name||pkg.name}${conf.sfx||''}${conf.ext||'.js'}`
  const plugins = [
  	rollup_ts2(conf.ts_config || {}),
    rollup_noderesolve({
      jsnext: true,
      main: true,
      browser: true
	  })
  ]
    .concat(conf.plugins || [])
    
  task(() =>
    rollup.rollup({
      input: input,
      external: Object.keys(pkg.dependencies),
      plugins: plugins
    }).then(bundle => bundle.write({
      file: dest,
      format: conf.format,
      sourcemap: conf.sourceMap === undefined ? true : conf.sourceMap,
      name: pkg.name,
    }))
  );
}

task(() => {
  const fs = require("fs-extra");
  fs.copy('./src/manifest.json', './dist/manifest.json', function (err) {
    if (err) return console.error(err)
    console.log('manifest copied')
  });
  fs.copy('./src/popup.html', './dist/popup.html', function (err) {
    if (err) return console.error(err)
    console.log('popup.html copied')
  });
  fs.copy('./assets', './dist/assets', function (err) {
    if (err) return console.error(err)
    console.log('assets copied')
  });
})

task(() => {
  console.log('')
  let p = "dist"
  fs.readdir(p, function (err, files) {
    if (err) throw err;
    let t = files.map(file => path.join(p, file))
      .filter(file => fs.statSync(file).isFile() && !file.includes('.map'))
      .map(file => [file, filesize(fs.statSync(file).size)]);
    console.log(text_table(t, { align: [ 'l', 'r' ] }));
  });
})

promise.catch(err => console.error(err.stack)); // eslint-disable-line no-console
