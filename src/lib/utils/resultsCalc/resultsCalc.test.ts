import { describe, it, expect } from 'vitest';
import { resultsCalc } from './resultsCalc';
import type { Option, Result } from '$lib/types';

describe('resultsCalc', () => {
	it('should calculate results correctly for a basic case', () => {
		const options: Option[] = [
			{ name: 'Option 1', ratings: [5, 10, 15] },
			{ name: 'Option 2', ratings: [10, 5, 20] },
			{ name: 'Option 3', ratings: [15, 20, 25] }
		];

		const normalizedImportances = [0.2, 0.3, 0.5];

		const result: Result[] = resultsCalc(options, normalizedImportances);

		expect(result).toEqual([
			{ optionName: 'Option 1', score: 0.24404761904761904 },
			{ optionName: 'Option 2', score: 0.2761904761904762 },
			{ optionName: 'Option 3', score: 0.4797619047619047 }
		]);
		expect(result[0].score + result[1].score + result[2].score).toBe(1);
	});

	it('should handle empty options array', () => {
		const options: Option[] = [];
		const normalizedImportances: number[] = [];

		const result = resultsCalc(options, normalizedImportances);

		expect(result).toEqual([]);
	});

	it('should handle cases where all options have zero ratings', () => {
		const options: Option[] = [
			{ name: 'Option 1', ratings: [0, 0, 0] },
			{ name: 'Option 2', ratings: [0, 0, 0] }
		];

		const normalizedImportances = [0.4, 0.4, 0.2];

		const result = resultsCalc(options, normalizedImportances);

		// Since all ratings are 0, the score should be 0 for all options
		expect(result).toEqual([
			{ optionName: 'Option 1', score: 0 },
			{ optionName: 'Option 2', score: 0 }
		]);
	});

	it('should handle a single option with multiple ratings', () => {
		const options: Option[] = [{ name: 'Option 1', ratings: [1, 2, 3] }];

		const normalizedImportances = [0.1, 0.4, 0.5];

		const result = resultsCalc(options, normalizedImportances);

		expect(result).toEqual([{ optionName: 'Option 1', score: 1 }]);
	});

	it('should handle normalizedImportances with all zero values', () => {
		const options: Option[] = [
			{ name: 'Option 1', ratings: [5, 10, 15] },
			{ name: 'Option 2', ratings: [10, 5, 20] }
		];

		const normalizedImportances = [0, 0, 0];

		const result = resultsCalc(options, normalizedImportances);

		expect(result).toEqual([
			{ optionName: 'Option 1', score: 0 },
			{ optionName: 'Option 2', score: 0 }
		]);
	});
});
