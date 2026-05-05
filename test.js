import assert from 'node:assert';
import {test, describe} from 'node:test';
import nanoparse from './index.js';

describe('nanoparse', () => {
	test('parses single flag as true', () => {
		const result = nanoparse(['-a']);
		assert.deepStrictEqual(result.flags, {a: true});
	});

	test('parses multiple single flags', () => {
		const result = nanoparse(['-a', '-b', '-c']);
		assert.deepStrictEqual(result.flags, {a: true, b: true, c: true});
	});

	test('parses flag with value', () => {
		const result = nanoparse(['--name', 'john']);
		assert.deepStrictEqual(result.flags, {name: 'john'});
	});

	test('parses flag with = value', () => {
		const result = nanoparse(['--name=john']);
		assert.deepStrictEqual(result.flags, {name: 'john'});
	});

	test('parses short flag with value', () => {
		const result = nanoparse(['-n', 'john']);
		assert.deepStrictEqual(result.flags, {n: 'john'});
	});

	test('parses combined short flags', () => {
		const result = nanoparse(['-abc']);
		assert.deepStrictEqual(result.flags, {a: true, b: true, c: true});
	});

	test('parses combined short flags with final value', () => {
		const result = nanoparse(['-abc', 'value']);
		assert.deepStrictEqual(result.flags, {a: true, b: true, c: 'value'});
	});

	test('parses positional arguments', () => {
		const result = nanoparse(['foo', 'bar', 'baz']);
		assert.deepStrictEqual(result._, ['foo', 'bar', 'baz']);
	});

	test('parses extras after --', () => {
		const result = nanoparse(['foo', '--', 'bar', 'baz']);
		assert.deepStrictEqual(result._, ['foo']);
		assert.deepStrictEqual(result.extras, ['bar', 'baz']);
	});

	test('parses --no- flag as false', () => {
		const result = nanoparse(['--no-verbose']);
		assert.deepStrictEqual(result.flags, {verbose: false});
	});

	test('parses number values', () => {
		const result = nanoparse(['--count', '42']);
		assert.deepStrictEqual(result.flags, {count: 42});
	});

	test('parses string "true" as boolean', () => {
		const result = nanoparse(['--debug', 'true']);
		assert.deepStrictEqual(result.flags, {debug: true});
	});

	test('parses string "false" as boolean', () => {
		const result = nanoparse(['--debug', 'false']);
		assert.deepStrictEqual(result.flags, {debug: false});
	});

	test('handles mixed flags and positional args', () => {
		const result = nanoparse(['--verbose', 'true', 'input.txt']);
		assert.deepStrictEqual(result.flags, {verbose: true});
		assert.deepStrictEqual(result._, ['input.txt']);
	});

	test('handles empty input', () => {
		const result = nanoparse([]);
		assert.deepStrictEqual(result.flags, {});
		assert.deepStrictEqual(result._, []);
		assert.deepStrictEqual(result.extras, []);
	});
});
