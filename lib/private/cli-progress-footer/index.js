"use strict";

const count                  = require("es5-ext/string/#/count")
    , ensureString           = require("es5-ext/object/validate-stringifiable-value")
    , d                      = require("d")
    , strip                  = require("cli-color/strip")
    , overrideStdProps       = require("./override-std-props")
    , progressAnimationProps = require("./progress-animation-props")
    , repaintProps           = require("./repaint-props");

class CliProgressFooter {
	constructor(options) {
		Object.defineProperties(this, {
			_progressLinesCount: d(0),
			_progressOverflowLinesCount: d(0),
			_progressContent: d(""),
			_rawProgressRows: d([]),
			_lastOutLineLength: d(0)
		});
		this.overrideStd(options);
	}

	updateProgress(progressRows) {
		if (!Array.isArray(progressRows)) {
			progressRows = progressRows ? progressRows.split("\n") : [];
		}
		this._rawProgressRows = progressRows;
		if (progressRows.length) {
			if (this._shouldAddProgressAnimationPrefix) {
				const prefix = `${
					this._progressAnimationPrefixFrames[
						this._progressAnimationPrefixFramesCurrentIndex
					]
				} `;
				const paddingLength = [...strip(prefix)].length;
				progressRows = progressRows.map(progressRow => {
					if (!progressRow) return progressRow;
					return (
						prefix + progressRow.split("\n").join(`\n${ " ".repeat(paddingLength) }`)
					);
				});
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
}

Object.defineProperties(CliProgressFooter.prototype, {
	...progressAnimationProps,
	...overrideStdProps,
	...repaintProps
});

module.exports = CliProgressFooter;
