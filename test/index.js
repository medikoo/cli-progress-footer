"use strict";

const test                  = require("tape")
    , ansiRegex             = require("ansi-regex")()
    , initCliProgressFooter = require("../")
    , testWrite             = require("./_fixtures/test-write");

const exposeAnsi = str => str.replace(ansiRegex, csi => `[CSI ${ csi.slice(2) }]`);

test("cliProgressFooter", t => {
	const cliProgressFooter = initCliProgressFooter({
		overrideStdout: false,
		redirectStderr: false
	});
	let out = "";
	cliProgressFooter._writeOriginalStdout = data => (out += data);

	const expectedOut = testWrite(cliProgressFooter);

	t.equal(exposeAnsi(out), exposeAnsi(expectedOut));
	t.end();
});
