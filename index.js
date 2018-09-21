"use strict";

const isObject            = require("es5-ext/object/is-object")
    , count               = require("es5-ext/string/#/count")
    , ensureString        = require("es5-ext/object/validate-stringifiable-value")
    , d                   = require("d")
    , cliErase            = require("cli-color/erase")
    , cliMove             = require("cli-color/move")
    , strip               = require("cli-color/strip")
    , overrideStdoutWrite = require("process-utils/override-stdout-write")
    , overrideStderrWrite = require("process-utils/override-stderr-write");

const defaultOptions = { overrideStdout: true, redirectStderr: true };

class CliProgressFooter {
	constructor(options) {
		Object.defineProperties(this, {
			_isStdoutOverriden: d(false),
			_isStderrRedirected: d(false),
			_progressLinesCount: d(0),
			_progressOverflowLinesCount: d(0),
			_lastOutLineLength: d(0)
		});
		this.overrideStd(options);
	}
	overrideStd(options = defaultOptions) {
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
	}
	restoreStd() {
		if (this._isStdoutOverriden) {
			this._stdoutData.restoreStdoutWrite();
			delete this._writeOriginalStdout;
			this._isStdoutOverriden = false;
		}
		if (this._isStderrRedirected) {
			this._stderrData.restoreStderrWrite();
			this._isStderrRedirected = false;
		}
	}
	updateProgress(data) {
		this._progressContent = ensureString(data);
		this._repaint();
		const newProgressLinesCount = count.call(data, "\n") + 1;
		if (newProgressLinesCount < this._progressLinesCount) {
			this._progressOverflowLinesCount += this._progressLinesCount - newProgressLinesCount;
		}
		this._progressLinesCount = newProgressLinesCount;
	}
	writeStdout(data) { this._repaint(ensureString(data)); }

	_writeOriginalStdout(data) { process.stdout.write(data); }
	_repaint(data = null) {
		if (this._progressOverflowLinesCount) {
			// Go to last line
			this._writeOriginalStdout(cliMove.bottom);
		}

		const progressBufferLinesCount =
			this._progressLinesCount + this._progressOverflowLinesCount;
		if (progressBufferLinesCount) {
			// Clear each progress line
			for (let i = 0; i < progressBufferLinesCount; ++i) {
				this._writeOriginalStdout(`${ cliErase.line }${ cliMove.lines(-1) }`);
			}
			// Position at last out char
			if (this._lastOutLineLength) {
				this._writeOriginalStdout(
					`${ cliMove.lines(-1) }${ cliMove.right(this._lastOutLineLength) }`
				);
			}
		}

		// Write eventual new std content
		if (data) {
			const lastNewLineIndex = data.lastIndexOf("\n");
			if (lastNewLineIndex === -1) this._lastOutLineLength += strip(data).length;
			this._lastOutLineLength = strip(data.slice(lastNewLineIndex + 1)).length;
			if (this._lastOutLineLength) data += "\n";

			if (this._progressOverflowLinesCount) {
				this._progressOverflowLinesCount = Math.max(
					this._progressOverflowLinesCount - count.call(data, "\n"), 0
				);
			}
			this._writeOriginalStdout(data);
		}

		if (!this._progressContent) return;

		// Write progess footer
		this._writeOriginalStdout(`\n${ this._progressContent }`);
	}
}

module.exports = (options = defaultOptions) => new CliProgressFooter(options);
