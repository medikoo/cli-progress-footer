"use strict";

const d                   = require("d")
    , overrideStdoutWrite = require("process-utils/override-stdout-write")
    , overrideStderrWrite = require("process-utils/override-stderr-write");

module.exports = {
	_isStdoutOverriden: d(false),
	_isStderrRedirected: d(false),
	overrideStd: d(function () {
		if (!this._isStdoutOverriden && this._shouldOverrideStdout) {
			this._stdoutData = overrideStdoutWrite(data => this._repaint(data));
			this._writeOriginalStdout = this._stdoutData.originalStdoutWrite;
			this._isStdoutOverriden = true;
		}
		if (!this._isStderrRedirected && this._shouldRedirectStderr) {
			this._stderrData = overrideStderrWrite(data => process.stdout.write(data));
			this._isStderrRedirected = true;
		}
		this._isActive = true;
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
		this._isActive = false;
	})
};
