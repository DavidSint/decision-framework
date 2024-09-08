import { describe, it, expect } from 'vitest';
import { normalizeDimensionImportances } from './normalizeDimensionImportances';
import type { Dimension } from '$lib/types';

describe('normalizeDimensionImportances', () => {
	it('should normalize dimension importances for a basic case', () => {
		const dimensions: Dimension[] = [
			{ name: 'Dimension 1', importance: 1 },
			{ name: 'Dimension 2', importance: 1 }
		];

		const normalizedImportances = normalizeDimensionImportances(dimensions);

		expect(normalizedImportances).toEqual([0.5, 0.5]);
	});

	it('should return an empty array when no dimensions are provided', () => {
		const dimensions: Dimension[] = [];

		const normalizedImportances = normalizeDimensionImportances(dimensions);

		expect(normalizedImportances).toEqual([]);
	});

	it('should handle dimensions with zero importance values', () => {
		const dimensions: Dimension[] = [
			{ name: 'Dimension 1', importance: 0 },
			{ name: 'Dimension 2', importance: 0 },
			{ name: 'Dimension 3', importance: 0 }
		];

		const normalizedImportances = normalizeDimensionImportances(dimensions);

		expect(normalizedImportances).toEqual([0, 0, 0]);
	});

	it('should handle a single dimension', () => {
		const dimensions: Dimension[] = [{ name: 'Dimension 1', importance: 50 }];

		const normalizedImportances = normalizeDimensionImportances(dimensions);

		expect(normalizedImportances).toEqual([1]);
	});

	it('should handle negative importance values', () => {
		const dimensions: Dimension[] = [
			{ name: 'Dimension 1', importance: -10 },
			{ name: 'Dimension 2', importance: -20 },
			{ name: 'Dimension 3', importance: -30 }
		];

		const normalizedImportances = normalizeDimensionImportances(dimensions);

		const totalImportance = -10 + -20 + -30;
		expect(normalizedImportances).toEqual([
			-10 / totalImportance,
			-20 / totalImportance,
			-30 / totalImportance
		]);
	});

	it('should handle a mix of positive and zero importance values', () => {
		const dimensions: Dimension[] = [
			{ name: 'Dimension 1', importance: 0 },
			{ name: 'Dimension 2', importance: 10 },
			{ name: 'Dimension 3', importance: 20 }
		];

		const normalizedImportances = normalizeDimensionImportances(dimensions);

		const totalImportance = 0 + 10 + 20;
		expect(normalizedImportances).toEqual([
			0 / totalImportance,
			10 / totalImportance,
			20 / totalImportance
		]);
	});
});
