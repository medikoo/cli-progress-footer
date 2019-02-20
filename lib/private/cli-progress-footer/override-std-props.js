"use strict";

const isObject            = require("es5-ext/object/is-object")
    , d                   = require("d")
    , overrideStdoutWrite = require("process-utils/override-stdout-write")
    , overrideStderrWrite = require("process-utils/override-stderr-write");

const defaultOptions = { overrideStdout: true, redirectStderr: true };

module.exports = {
	_isStdoutOverriden: d(false),
	_isStderrRedirected: d(false),
	overrideStd: d(function (options = defaultOptions) {
		if (!isObject(options)) options = defaultOptions;
		if (options.overrideStdout && !this._isStdoutOverriden) {
			this._stdoutData = overrideStdoutWrite(data => this._repaint(data));
			this._writeOriginalStdout = this._stdoutData.originalStdoutWrite;
			this._isStdoutOverriden = true;
		}
		if (options.redirectStderr && !this._isStderrRedirected) {
			this._stderrData = overrideStderrWrite(data => process.stdout.write(data));
			this._isStderrRedirected = true;
		}
	}),
	restoreStd: d(function () {
		if (this._isStdoutOverriden) {
			this._stdoutData.restoreStdoutWrite();
			delete this._writeOriginalStdout;
			this._isStdoutOverriden = false;
		}
		if (this._isStderrRedirected) {
			this._stderrData.restoreStderrWrite();
			this._isStderrRedirected = false;
		}
	})
};
