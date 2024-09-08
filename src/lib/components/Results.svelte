<script lang="ts">
	import type { Result } from '$lib/types';

	export let results: Result[];

	$: sortedResults = [...results].sort((a, b) => b.score - a.score);
	$: winner = sortedResults[0];
</script>

<section class="results">
	<h2 data-testid="results-title">Results</h2>
	<ul class="result-list">
		{#each sortedResults as result, index}
			<li class="result-item" style="--score: {result.score / winner.score}">
				<span class="rank">#{index + 1}</span>
				<span class="option-name">{result.optionName}</span>
				<span class="score" data-testid={`${result.optionName}-score-text`}
					>{(result.score * 100).toFixed(2)}</span
				>
				<div class="score-bar"></div>
			</li>
		{/each}
	</ul>

	{#if winner}
		<div class="winner">
			<h3>The winner is:</h3>
			<p data-testid="winner-text">
				{winner.optionName} with a score of {(winner.score * 100).toFixed(2)}
			</p>
		</div>
	{/if}
</section>

<style>
	.results {
		margin-bottom: 20px;
	}

	.result-list {
		margin-bottom: 20px;
	}

	.result-item {
		display: flex;
		align-items: center;
		background-color: var(--selection-background-color);
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 5px;
		position: relative;
		overflow: hidden;
	}

	.rank {
		font-weight: bold;
		margin-right: 10px;
	}

	.option-name {
		flex: 1;
	}

	.score {
		font-weight: bold;
		margin-left: 10px;
	}

	.score-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: calc(var(--score) * 100%);
		background-color: rgba(46, 204, 113, 0.2);
		z-index: 0;
	}

	.winner {
		background-color: var(--secondary-color);
		color: white;
		padding: 15px;
		border-radius: 4px;
		text-align: center;
	}

	.winner h3 {
		margin-top: 0;
		color: white;
	}
</style>
