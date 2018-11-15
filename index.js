"use strict";

const isObject            = require("es5-ext/object/is-object")
    , count               = require("es5-ext/string/#/count")
    , ensureString        = require("es5-ext/object/validate-stringifiable-value")
    , ensureValue         = require("es5-ext/object/valid-value")
    , ensureInterval      = require("timers-ext/valid-timeout")
    , d                   = require("d")
    , autoBind            = require("d/auto-bind")
    , cliErase            = require("cli-color/erase")
    , cliMove             = require("cli-color/move")
    , strip               = require("cli-color/strip")
    , overrideStdoutWrite = require("process-utils/override-stdout-write")
    , overrideStderrWrite = require("process-utils/override-stderr-write");

const defaultOptions = { overrideStdout: true, redirectStderr: true }
    , isWindows = process.platform === "win32";

class CliProgressFooter {
	constructor(options) {
		Object.defineProperties(this, {
			_isStdoutOverriden: d(false),
			_isStderrRedirected: d(false),
			_progressLinesCount: d(0),
			_progressOverflowLinesCount: d(0),
			_progressContent: d(""),
			_lastOutLineLength: d(0),
			_shouldAddProgressAnimationPrefix: d(false),
			_progressAnimationPrefixFrames: d(
				isWindows
					? ["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"]
					: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
			),
			_progressAnimationInterval: d(isWindows ? 100 : 80),
			_progressAnimationPrefixFramesCurrentIndex: d(0),
			_progressAnimationIntervalId: d(null)
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
	get progressAnimationPrefixFrames() { return this._progressAnimationPrefixFrames; }
	set progressAnimationPrefixFrames(frames) {
		frames = Array.from(frames, ensureString);
		if (frames.length < 2) throw new TypeError("Expected at least two animation frames");
		this._progressAnimationPrefixFrames = frames;
		this._progressAnimationPrefixFramesCurrentIndex = 0;
		this._rewriteProgressAnimationFrame();
	}
	get progressAnimationInterval() { return this._progressAnimationInterval; }
	set progressAnimationInterval(interval) {
		interval = ensureInterval(interval);
		if (this._progressAnimationInterval === interval) return;
		this._progressAnimationInterval = interval;
		if (!this._shouldAddProgressAnimationPrefix) return;
		clearInterval(this._progressAnimationIntervalId);
		this._progressAnimationIntervalId = setInterval(
			this._rewriteProgressAnimationFrame, interval
		);
		if (this._progressAnimationIntervalId.unref) this._progressAnimationIntervalId.unref();
	}
	get shouldAddProgressAnimationPrefix() { return this._shouldAddProgressAnimationPrefix; }
	set shouldAddProgressAnimationPrefix(value) {
		value = Boolean(ensureValue(value));
		if (this._shouldAddProgressAnimationPrefix === value) return;
		if (this._progressContent) {
			const prefix = `${
				this._progressAnimationPrefixFrames[this._progressAnimationPrefixFramesCurrentIndex]
			} `;
			let progressRows = this._progressContent.split("\n");
			if (value) {
				progressRows = progressRows.map(progressRow => progressRow && prefix + progressRow);
			} else {
				progressRows = progressRows.map(progressRow => progressRow.slice(prefix.length));
			}
			this._progressContent = progressRows.join("\n");
			this._repaint();
		}
		this._shouldAddProgressAnimationPrefix = value;
		if (value) {
			this._progressAnimationIntervalId = setInterval(
				this._rewriteProgressAnimationFrame, 80
			);
			if (this._progressAnimationIntervalId.unref) this._progressAnimationIntervalId.unref();
		} else {
			clearInterval(this._progressAnimationIntervalId);
		}
	}
	updateProgress(progressRows) {
		if (!Array.isArray(progressRows)) {
			progressRows = progressRows ? progressRows.split("\n") : [];
		}
		if (progressRows.length) {
			if (this._shouldAddProgressAnimationPrefix) {
				const prefix = `${
					this._progressAnimationPrefixFrames[
						this._progressAnimationPrefixFramesCurrentIndex
					]
				} `;
				progressRows = progressRows.map(progressRow => progressRow && prefix + progressRow);
			}
			this._progressContent = `${ progressRows.join("\n") }\n`;
		} else {
			this._progressContent = "";
		}
		this._repaint();
		const newProgressLinesCount = this._progressContent
			? count.call(this._progressContent, "\n") + 1
			: 0;
		if (newProgressLinesCount !== this._progressLinesCount) {
			this._progressOverflowLinesCount += this._progressLinesCount - newProgressLinesCount;
			if (this._progressOverflowLinesCount < 0) this._progressOverflowLinesCount = 0;
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

Object.defineProperties(
	CliProgressFooter.prototype,
	autoBind({
		_rewriteProgressAnimationFrame: d(function () {
			if (!this._progressContent) return;
			const oldPrefix = `${
				this._progressAnimationPrefixFrames[this._progressAnimationPrefixFramesCurrentIndex]
			} `;
			this._progressAnimationPrefixFramesCurrentIndex =
				(this._progressAnimationPrefixFramesCurrentIndex + 1) %
				this._progressAnimationPrefixFrames.length;
			const newPrefix = `${
				this._progressAnimationPrefixFrames[this._progressAnimationPrefixFramesCurrentIndex]
			} `;
			this._progressContent = this._progressContent
				.split("\n")
				.map(progressRow => progressRow && newPrefix + progressRow.slice(oldPrefix.length))
				.join("\n");
			this._repaint();
		})
	})
);

module.exports = (options = defaultOptions) => new CliProgressFooter(options);
