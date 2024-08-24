<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Dimension, Option } from '$lib/types';

	export let dimensions: Dimension[];
	export let options: Writable<Option[]>;
	export let newOption: Writable<Option>;

	function addOption() {
		if ($newOption.name && $newOption.ratings.length === dimensions.length) {
			options.update((opts) => [
				...opts,
				{
					name: $newOption.name,
					ratings: $newOption.ratings
				}
			]);
			$newOption.name = '';
			$newOption.ratings = [];
		}
	}
</script>

<div class="option-input">
	<h2>Enter Options</h2>
	<p>
		Now is when we add the options, and we can now score the options against each of our previously
		chosen dimensions.
	</p>
	<p>
		For example, if comparing car options, you may pick a 'Ford' and a 'Ferarri', and will then need
		to rate these cars on each dimension with a score.
	</p>
	<ul class="option-list">
		{#if $options.length > 0}
			<h3>Chosen Options</h3>
		{/if}
		{#each $options as option}
			<li class="option-item">
				<h4 class="option-name">{option.name}</h4>
				<ul class="rating-list">
					{#each option.ratings as rating, index}
						<li class="rating-item">
							<span class="dimension-name">{dimensions[index].name}:</span>
							<span class="rating-value">{rating}</span>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div class="input-group">
		<div>
			<input bind:value={$newOption.name} placeholder="Option name" />
		</div>
		{#each dimensions as dimension, index}
			<div class="option-rating-input">
				<input
					type="number"
					bind:value={$newOption.ratings[index]}
					placeholder="Rating for {dimension.name}"
					min="0"
				/>
			</div>
		{/each}
		<div class="add-option-button">
			<button on:click={addOption}>Add Option</button>
		</div>
	</div>
</div>

<style>
	.option-input {
		margin-bottom: 20px;
	}

	.option-list {
		margin-bottom: 20px;
	}

	.option-item {
		background-color: var(--selection-background-color);
		padding: 15px;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.option-name {
		margin-top: 0;
		color: var(--primary-color);
	}

	.rating-list {
		margin: 0;
		padding: 0;
	}

	.rating-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 5px;
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}

	.input-group input {
		flex: 1;
		min-width: 120px;
	}

	.option-rating-input {
		margin-left: 30px;
	}

	.add-option-button {
		display: inline-block;
	}
</style>
