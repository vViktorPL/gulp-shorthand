'use strict';

var gutil = require('gulp-util');
var shorthand = require('shrthnd');
var through = require('through2');

module.exports = function (options) {
	var shorthandLibOptions = {};
	options = options || {};

	if ('androidCompatible' in options && options.androidCompatible) {
		shorthandLibOptions.ignoreProperty = ['background'];
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new Error('Streaming is not supported'));
			return;
		}

		try {
			var ret = shorthand(file.contents.toString(), shorthandLibOptions);
			file.contents = new Buffer(ret.string);
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-shorthand:', err, {
				fileName: file.path
			}));
		}

		cb();
	});
};
