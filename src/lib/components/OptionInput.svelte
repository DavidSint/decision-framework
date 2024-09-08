<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Dimension, Option } from '$lib/types';
	import Delete from './Delete.svelte';
	import { getContext } from 'svelte';

	const dimensions: Writable<Dimension[]> = getContext('dimensions');
	const options: Writable<Option[]> = getContext('options');
	export let newOption: Writable<Option>;

	function addOption() {
		if ($newOption.name && $newOption.ratings.length === $dimensions.length) {
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

<section class="option-input">
	<h2 data-testid="options-title">Enter Options</h2>
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
		{#each $options as option, optIndex}
			<li class="option-item">
				<div class="option-title-row">
					<h4 class="option-name">{option.name}</h4>
					<Delete index={optIndex} type="option"></Delete>
				</div>
				<ul class="rating-list">
					{#each option.ratings as rating, ratingIndex}
						<li class="rating-item">
							<span class="dimension-name">{$dimensions[ratingIndex].name}:</span>
							<span class="rating-value">{rating}</span>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<div class="input-group">
		<div>
			<input
				bind:value={$newOption.name}
				placeholder="Option name"
				data-testid="option-name-input"
			/>
		</div>
		{#each $dimensions as dimension, index}
			<div class="option-rating-input">
				<input
					type="number"
					bind:value={$newOption.ratings[index]}
					placeholder="Rating for {dimension.name}"
					min="0"
					data-testid={`option-rating-i${index}-input`}
				/>
			</div>
		{/each}
		<div class="add-option-button">
			<button on:click={addOption} data-testid="option-add-button">Add Option</button>
		</div>
	</div>
</section>

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

	.option-title-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: var(--primary-color) 1px solid;
	}

	.option-name {
		margin: 0;
		color: var(--primary-color);
		word-wrap: break-word;
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
		field-sizing: content;
		max-width: 82vw;
	}

	.option-rating-input {
		margin-left: 30px;
	}

	.add-option-button {
		display: inline-block;
	}
</style>
