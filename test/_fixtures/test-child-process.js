"use strict";

const childProcess = require("child_process");
const getCliProgressFooter = require("../../");

const cliProgressFooter = getCliProgressFooter();
cliProgressFooter.shouldAddProgressAnimationPrefix = true;

const wait = ms => new Promise(resolve => { setTimeout(resolve, ms); });

(async () => {
	cliProgressFooter.updateProgress("Starting progress");

	await wait(1000);
	cliProgressFooter.updateProgress("Run spawn (default)");
	await new Promise(resolve => {
		childProcess.spawn("node", ["other.js"]).on("close", resolve);
	});

	await wait(1000);
	cliProgressFooter.updateProgress("Run spawn:pipe");
	await new Promise(resolve => {
		const subProcess = childProcess.spawn("node", ["other.js"]).on("close", resolve);
		subProcess.stdout.pipe(process.stdout);
	});

	await wait(1000);
	cliProgressFooter.updateProgress("Run spawn:inherit");
	await new Promise(resolve => {
		childProcess.spawn("node", ["other.js"], { stdio: "inherit" }).on("close", resolve);
	});

	await wait(1000);
	cliProgressFooter.updateProgress("Run spawnSync (default)");
	childProcess.spawnSync("node", ["other.js"]);

	await wait(1000);
	cliProgressFooter.updateProgress("Run spawnSync:inherit");
	childProcess.spawnSync("node", ["other.js"], { stdio: "inherit" });

	await wait(1000);
	cliProgressFooter.updateProgress("Run exec");
	await new Promise(resolve => { childProcess.exec("node other.js").on("close", resolve); });

	await wait(1000);
	cliProgressFooter.updateProgress("Run execSync:inherit");
	childProcess.execSync("node other.js", { stdio: "inherit" });

	await wait(1000);
	cliProgressFooter.updateProgress("Run fork (default)");
	await new Promise(resolve => { childProcess.fork("other.js").on("close", resolve); });

	await wait(1000);
	cliProgressFooter.updateProgress("Run fork:inherit");
	await new Promise(resolve => {
		childProcess.fork("other.js", [], { stdio: "inherit" }).on("close", resolve);
	});

	cliProgressFooter.updateProgress("Ending progress");

	await wait(1000);
	cliProgressFooter.updateProgress();
})();
