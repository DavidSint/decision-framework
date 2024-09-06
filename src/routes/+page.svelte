<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import type { Dimension, NewDimension, Option } from '$lib/types';
	import DimensionInput from '$lib/components/DimensionInput.svelte';
	import OptionInput from '$lib/components/OptionInput.svelte';
	import Results from '$lib/components/Results.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import { setContext, onMount } from 'svelte';

	const dimensions = writable<Dimension[]>([]);
	const newDimension = writable<NewDimension>({
		name: ''
	});
	const options = writable<Option[]>([]);
	const newOption = writable<Option>({
		name: '',
		ratings: []
	});
	setContext('dimensions', dimensions);
	setContext('options', options);

	$: normalizedDimensionImportances = derived(dimensions, ($dimensions) => {
		const total = $dimensions.reduce((sum, dim) => sum + dim.importance, 0);
		return $dimensions.map((dim) => dim.importance / total);
	});

	$: results = derived([options, normalizedDimensionImportances], ([$options, $normalizedImportance]) => {
		const dimensionScoreWeights = $normalizedImportance.map((_, importanceIndex) => {
			return $options.reduce((sum, opt) => sum + opt.ratings[importanceIndex], 0);
		});

		return $options.map((option) => ({
			optionName: option.name,
			score: option.ratings.reduce(
				(sum, rating, index) => sum + (rating / dimensionScoreWeights[index]) * $normalizedImportance[index],
				0
			)
		}));
	});

	let step = 1;

	function nextStep() {
		let shouldProceed = true;
		if (step === 1) {
			if ($newDimension.name !== '') {
				shouldProceed = confirm(
					'You have unsaved dimensions.\nClick OK if you would like to proceed anyway, or Cancel if you want to add your unadded dimension.'
				);
			}
			if ($dimensions.length === 0) {
				shouldProceed = false;
				alert('You must enter a dimension to proceed');
			}
		}
		if (step === 2) {
			if ($newOption.name !== '') {
				shouldProceed = confirm(
					'You have an unsaved option.\nClick OK if you would like to proceed anyway, or Cancel if you want to add your unsaved options.'
				);
			}

			if ($options.length === 0) {
				shouldProceed = false;
				alert('You must enter a dimension to proceed');
			}
		}
		if (!shouldProceed) {
			return;
		}
		step++;
	}

	function prevStep() {
		step--;
	}
	onMount(() => {
		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: 'Decision Maker',
			description:
				'A powerful decision-making tool to help you make the best choices by comparing options across multiple dimensions.',
			applicationCategory: 'Productivity',
			operatingSystem: 'Web'
		});
		document.head.appendChild(script);
	});
</script>

<Seo />

<main class="container">
	<h1>Decision Maker</h1>

	<div class="step-container">
		{#if step === 1}
			<DimensionInput {newDimension} />
			<div class="right-hand-next-button">
				<button on:click={nextStep}>Next</button>
			</div>
		{:else if step === 2}
			<OptionInput {newOption} />
			<div class="button-group">
				<button on:click={prevStep}>Back</button>
				<button on:click={nextStep}>Next</button>
			</div>
		{:else}
			<Results results={$results} />
			<button on:click={prevStep}>Back</button>
		{/if}
	</div>
</main>

<style>
	.step-container {
		background-color: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.button-group {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	.right-hand-next-button {
		display: flex;
		flex-direction: row-reverse;
	}
</style>
