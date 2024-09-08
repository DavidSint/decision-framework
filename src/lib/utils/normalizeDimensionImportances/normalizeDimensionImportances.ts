import type { Dimension } from '$lib/types';

export function normalizeDimensionImportances(dimensions: Dimension[]) {
	const total = dimensions.reduce((sum, dim) => sum + dim.importance, 0);
	return dimensions.map((dim) => dim.importance / total || 0);
}
