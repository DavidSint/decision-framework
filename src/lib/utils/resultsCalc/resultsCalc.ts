import type { Option, Result } from '$lib/types';

export function resultsCalc(options: Option[], normalizedImportances: number[]): Result[] {
	const dimensionScoreWeights = normalizedImportances.map((_, importanceIndex) => {
		return options.reduce((sum, opt) => sum + opt.ratings[importanceIndex], 0);
	});

	return options.map((option) => ({
		optionName: option.name,
		score:
			option.ratings.reduce(
				(sum, rating, index) =>
					sum + (rating / dimensionScoreWeights[index]) * normalizedImportances[index],
				0
			) || 0
	}));
}
