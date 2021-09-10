"use strict";

const count    = require("es5-ext/string/#/count")
    , d        = require("d")
    , cliErase = require("cli-color/erase")
    , cliMove  = require("cli-color/move")
    , strip    = require("cli-color/strip");

module.exports = {
	_repaint: d(function (data = null) {
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
	})
};
