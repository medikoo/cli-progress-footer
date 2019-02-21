"use strict";

const count                  = require("es5-ext/string/#/count")
    , ensureString           = require("es5-ext/object/validate-stringifiable-value")
    , d                      = require("d")
    , cliErase               = require("cli-color/erase")
    , cliMove                = require("cli-color/move")
    , strip                  = require("cli-color/strip")
    , overrideStdProps       = require("./override-std-props")
    , progressAnimationProps = require("./progress-animation-props");

class CliProgressFooter {
	constructor(options) {
		Object.defineProperties(this, {
			_progressLinesCount: d(0),
			_progressOverflowLinesCount: d(0),
			_progressContent: d(""),
			_lastOutLineLength: d(0)
		});
		this.overrideStd(options);
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
			this._writeOriginalStdout(cliMove.down(this._progressOverflowLinesCount));
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

Object.defineProperties(CliProgressFooter.prototype, progressAnimationProps);
Object.defineProperties(CliProgressFooter.prototype, overrideStdProps);

module.exports = CliProgressFooter;
