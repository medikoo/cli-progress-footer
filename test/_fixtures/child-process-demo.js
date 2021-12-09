"use strict";

const wait = ms => new Promise(resolve => { setTimeout(resolve, ms); });

(async () => {
	process.stdout.write("RAZ\nOTHER LINE\nOTHER\n");
	await wait(500);
	process.stderr.write("DWA\nOTHER LINE\nOTHER\n");
	await wait(500);
	process.stdout.write("TRZY\nOTHER LINE\nOTHER\n");
})();
