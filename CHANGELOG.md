# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.2](https://github.com/medikoo/cli-progress-footer/compare/v2.0.1...v2.0.2) (2021-09-14)

### Bug Fixes

- Ensure proper handling of feed data that doesn't end with new line ([07678a3](https://github.com/medikoo/cli-progress-footer/commit/07678a38775b7231704eac12a5b4829c632ee9a9))
- Fix internal string length calculation for rich unicode chars ([c41afab](https://github.com/medikoo/cli-progress-footer/commit/c41afab24d07aaa18ee285526765d2175fac3f89))
- Fix last feed line handling when terminal wrapping occurs ([20e1941](https://github.com/medikoo/cli-progress-footer/commit/20e1941d27d8ff5256752f311b71896c376bb56d))

### [2.0.1](https://github.com/medikoo/cli-progress-footer/compare/v2.0.0...v2.0.1) (2021-09-10)

### Bug Fixes

- Fix output updates in case of output wrapping ([1abb356](https://github.com/medikoo/cli-progress-footer/commit/1abb35634f7eba335126bfe88846eb78ec8dbb1a))
- Apply std stream overrides only when displaying progress ([d7023b1](https://github.com/medikoo/cli-progress-footer/commit/d7023b1be3a7371ac72f3924356ea76b1ca783da))

### Maintenance Improvements

- Seclude `_repaint` method ([bd99cb0](https://github.com/medikoo/cli-progress-footer/commit/bd99cb032e710757258d18ef4aadc48c1e094624))

## [2.0.0](https://github.com/medikoo/cli-progress-footer/compare/v1.1.1...v2.0.0) (2021-09-06)

### ⚠ BREAKING CHANGES

- Node.js version 10 or later is required

### Features

- Support for multiline progress rows ([cd25917](https://github.com/medikoo/cli-progress-footer/commit/cd2591798815fd68423d2eec203017d1892fb807))

### Maintenance Improvements

- Drop support for Node.js versions below v10 ([022bc5a](https://github.com/medikoo/cli-progress-footer/commit/022bc5a5a58cfedc90fa7275a65814a1758d0a20))
- Upgrade `ansi-regex` to v5 ([3ccc4ee](https://github.com/medikoo/cli-progress-footer/commit/3ccc4ee02f56648f713ae51cf87673c36002e9b0))
- Upgrade `cli-color` to v2 ([50162aa](https://github.com/medikoo/cli-progress-footer/commit/50162aad8128395d49ac8fde1ca349c72e91afdf))
- Upgrade `process-utils` to v4 ([09e81c0](https://github.com/medikoo/cli-progress-footer/commit/09e81c04a0a7e6dfdecd1f0980e74289d57e7652))

## [1.1.1](https://github.com/medikoo/cli-progress-footer/compare/v1.1.0...v1.1.1) (2019-02-21)

### Bug Fixes

- scroll to last progress line not bottom ([f77abaa](https://github.com/medikoo/cli-progress-footer/commit/f77abaa))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/medikoo/cli-progress-footer/compare/v1.0.0...v1.1.0) (2018-11-15)

### Bug Fixes

- default with windows supported chars on windows ([0490f8e](https://github.com/medikoo/cli-progress-footer/commit/0490f8e))

### Features

- support progress interval customization ([7ac4d5e](https://github.com/medikoo/cli-progress-footer/commit/7ac4d5e))

<a name="1.0.0"></a>

# 1.0.0 (2018-10-23)

### Bug Fixes

- variable progress lines count handling ([cebaedd](https://github.com/medikoo/cli-progress-footer/commit/cebaedd))

### Features

- ensure blank line between ongoing and progresss content ([b128311](https://github.com/medikoo/cli-progress-footer/commit/b128311))
- ensure new line at end of progress content ([995addb](https://github.com/medikoo/cli-progress-footer/commit/995addb))
- Optionally automate animated row prefix ([3649b9a](https://github.com/medikoo/cli-progress-footer/commit/3649b9a))
- support array as updateProgress input ([1009760](https://github.com/medikoo/cli-progress-footer/commit/1009760))
