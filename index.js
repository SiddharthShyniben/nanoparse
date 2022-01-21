export default function main(input) {
	let extras = [];
	let args = input;
	const _ = [];

	if (input.includes('--')) {
		extras = input.slice(input.indexOf('--') + 1);
		args = input.slice(0, input.indexOf('--'));
	}

	const newArgs = [];

	for (let i = 0; i < args.length; i++) {
		const prev = args[i - 1];
		const curr = args[i];
		const next = args[i + 1];

		const nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

		const pushWithNext = x => {
			newArgs.push([x, nextIsValue ? next : true]);
		}

		if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
			newArgs.push(curr.split('='));
		} else if (/^-[^-].*/.test(curr)) {
			let current = curr;

			if (current.includes('=')) {
				const index = current.indexOf('=');
				newArgs.push([current.slice(index - 1, index), current.slice(index + 1, index + 2)])
				current = current.slice(0, index - 1) + current.slice(index + 2);
			}

			// Push all the flags but the last (ie x and y of -xyz) with true
			current.slice(1).split('').slice(0, -1).forEach(char => newArgs.push([char, true]));
			
			// If the next string is a value, push it with the last flag 
			const final = current[current.length - 1];
			pushWithNext(final);
		} else if (/^--.+/.test(curr) || /^-.+/.test(curr)) {
			pushWithNext(curr);
		} else {
			let valueTaken = newArgs.find(arg => arg[0] === prev);

			if (!valueTaken && /^-./.test(prev)) {
				const prevChar = prev[prev.length - 1];
				valueTaken = newArgs.find(arg => arg[0] === prevChar);
			}

			if (!valueTaken) _.push(curr);
		}
	}

	const flags = {};

	for (const arg of newArgs) {
		let key = arg[0].replace(/^-{1,2}/g, '');
		let value = arg[1];

		if (key.startsWith('no-') && [undefined, true].includes(value)) {
			key = key.slice(3)
			value = false;
		}

		flags[key] = parseValue(value);
	}

	return {flags, _: _.map(parseValue), extras: extras.map(parseValue)};
}

const parseValue = thing => {
	if (['true', true].includes(thing)) return true;
	if (['false', false].includes(thing)) return false;

	if (Number(thing)) return Number(thing);
	return thing;
}
