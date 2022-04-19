import { runCLI } from 'jest';
import { Config } from '@jest/types';
import { join } from 'path';

const argObj = (() => {
	const argvList = process.argv.slice(2);
	const resObj: { [key: string]: any } = {};
	argvList.forEach(item => {
		const data = item.split(/^--/)[1];
		if (!data) return;
		let [key, value] = data.split('=');
		switch(value) {
			case undefined: resObj[key] = true; break;
			case 'false': resObj[key] = false; break;
			case 'true': resObj[key] = true; break;
			case 'null': resObj[key] = null; break;
			default: try { resObj[key] = JSON.parse(value); } catch {
				resObj[key] = value;
			}; break;
		}
	});
	return resObj;
})();

const options: Config.Argv = {
	_: [],
	$0: 'test',
	testRegex: [
		'(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$'
	],
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverage: argObj.coverage,
};

runCLI(options, [join(__dirname, argObj.dir || '../src')]);