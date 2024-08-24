<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Dimension, NewDimension } from '$lib/types';

	export let dimensions: Writable<Dimension[]>;
	export let newDimension: Writable<NewDimension>;

	function addDimension() {
		if ($newDimension.name && ($newDimension.importance ?? 0) > 0) {
			dimensions.update((dims) => [
				...dims,
				{
					name: $newDimension.name,
					importance: $newDimension.importance ?? 0
				}
			]);
			$newDimension.name = '';
			$newDimension.importance = undefined;
		}
	}
</script>

<div class="dimension-input">
	<h2>Enter Dimensions</h2>
	<p>
		We will later define some options, but before we do that, let's define the dimensions that we
		will rate the options on. For example, if you are comparing car options, some dimensions may be
		the <strong>speed</strong>, the <strong>price</strong>, and <strong>the interior</strong>.
	</p>
	<p>For each dimension you choose, add a number for how important this feature is to you.</p>
	<ul class="dimension-list">
		{#if $dimensions.length > 0}
			<h3>Chosen Dimensions</h3>
		{/if}
		{#each $dimensions as dimension}
			<li class="dimension-item">
				<span class="dimension-name">{dimension.name}</span>
				<span class="dimension-importance">Importance: {dimension.importance}</span>
			</li>
		{/each}
	</ul>

	<div class="input-group">
		<input bind:value={$newDimension.name} placeholder="Dimension name" />
		<input type="number" bind:value={$newDimension.importance} placeholder="Importance" min="0" />
		<button on:click={addDimension}>Add Dimension</button>
	</div>
</div>

<style>
	.dimension-input {
		margin-bottom: 20px;
	}

	.dimension-list {
		margin-bottom: 20px;
	}

	.dimension-item {
		display: flex;
		justify-content: space-between;
		background-color: var(--selection-background-color);
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 5px;
	}

	.dimension-name {
		font-weight: bold;
	}

	.input-group {
		display: flex;
		gap: 10px;
		overflow-x: scroll;
	}

	.input-group input {
		flex: 1;
	}
</style>
