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
			// If last data write didn't end with new line, this new line was auto-added to ensure
			// there's a visible gap between logs feed and progress bar.
			// In such case we need erase this auto added line and position
			// at the end of written content
			if (this._lastOutLineLength) {
				const columns = process.stdout.columns || 80;
				this._writeOriginalStdout(
					`${ cliMove.lines(-1) }${
						cliMove.right(this._lastOutLineLength % columns || columns)
					}`
				);
			}
		}

		// Write eventual new feed content
		if (data) {
			const lastNewLineIndex = data.lastIndexOf("\n");
			if (lastNewLineIndex === -1) this._lastOutLineLength += [...strip(data)].length;
			this._lastOutLineLength = [...strip(data.slice(lastNewLineIndex + 1))].length;
			if (this._lastOutLineLength) {
				// This write didn't end with new line therefore we auto add new line to ensure
				// visible gap between feed and progress bar
				data += "\n";
			}

			if (this._progressOverflowLinesCount) {
				this._progressOverflowLinesCount = Math.max(
					this._progressOverflowLinesCount - count.call(data, "\n"), 0
				);
			}
			this._writeOriginalStdout(data);
		} else if (this._lastOutLineLength) {
			// Feed doesn't end with new line auti add new line to ensure
			// visible gap between it and progress bar
			this._writeOriginalStdout("\n");
		}

		if (!this._progressContent) return;

		// Write progess footer
		this._writeOriginalStdout(`\n${ this._progressContent }`);
	})
};
