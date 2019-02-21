"use strict";

const repeat                = require("es5-ext/string/#/repeat")
    , test                  = require("tape")
    , ansiRegex             = require("ansi-regex")()
    , cliErase              = require("cli-color/erase")
    , cliMove               = require("cli-color/move")
    , initCliProgressFooter = require("../");

const exposeAnsi = str => str.replace(ansiRegex, csi => `[CSI ${ csi.slice(2) }]`);

test("cliProgressFooter", t => {
	const cliProgressFooter = initCliProgressFooter({
		overrideStdout: false,
		redirectStderr: false
	});
	let out = "", expectedOut = "";
	cliProgressFooter._writeOriginalStdout = data => (out += data);

	cliProgressFooter.writeStdout("sample 1\n");
	expectedOut += "sample 1\n";

	cliProgressFooter.writeStdout("sample 2\n");
	expectedOut += "sample 2\n";

	cliProgressFooter.updateProgress(
		`${ [1, 2, 3, 4].map(item => `# item ${ item }`).join("\n") }`
	);
	expectedOut += `\n${ [1, 2, 3, 4].map(item => `# item ${ item }`).join("\n") }\n`;

	cliProgressFooter.writeStdout("sample 3\n");
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 5) }sample 3\n\n${
		[1, 2, 3, 4].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.updateProgress(
		`${ [1, 2, 3, 4, 5].map(item => `# item ${ item }`).join("\n") }`
	);
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 5) }\n${
		[1, 2, 3, 4, 5].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.writeStdout("sample 4\n");
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 6) }sample 4\n\n${
		[1, 2, 3, 4, 5].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.updateProgress(`${ [1, 2].map(item => `# item ${ item }`).join("\n") }`);
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 6) }\n${
		[1, 2].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.writeStdout("FOo\n");
	expectedOut += `${ cliMove.down(3) }${
		repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 6)
	}FOo\n\n${ [1, 2].map(item => `# item ${ item }`).join("\n") }\n`;

	cliProgressFooter.writeStdout("Mark");
	expectedOut += `${ cliMove.down(2) }${
		repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 5)
	}Mark\n\n${ [1, 2].map(item => `# item ${ item }`).join("\n") }\n`;

	cliProgressFooter.writeStdout("Mark\n");
	expectedOut += `${ cliMove.down(1) }${
		repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 4)
	}${ cliMove.lines(-1) }${ cliMove.right(4) }Mark\n\n${
		[1, 2].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.updateProgress(`${ [1, 3].map(item => `# item ${ item }`).join("\n") }`);
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 3) }\n${
		[1, 3].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.updateProgress(
		`${ [1, 3, 4, 5].map(item => `# item ${ item }`).join("\n") }`
	);
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 3) }\n${
		[1, 3, 4, 5].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.updateProgress(`${ [1, 3].map(item => `# item ${ item }`).join("\n") }`);
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 5) }\n${
		[1, 3].map(item => `# item ${ item }`).join("\n")
	}\n`;

	cliProgressFooter.updateProgress(
		`${ [1, 3, 4, 5].map(item => `# item ${ item }`).join("\n") }`
	);
	expectedOut += `${ cliMove.down(2) }${
		repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 5)
	}\n${ [1, 3, 4, 5].map(item => `# item ${ item }`).join("\n") }\n`;

	cliProgressFooter.updateProgress(`${ [1, 3].map(item => `# item ${ item }`).join("\n") }`);
	expectedOut += `${ repeat.call(`${ cliErase.line }${ cliMove.lines(-1) }`, 5) }\n${
		[1, 3].map(item => `# item ${ item }`).join("\n")
	}\n`;

	t.equal(exposeAnsi(out), exposeAnsi(expectedOut));
	t.end();
});
