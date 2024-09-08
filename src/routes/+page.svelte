<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import type { Dimension, NewDimension, Option } from '$lib/types';
	import DimensionInput from '$lib/components/DimensionInput.svelte';
	import OptionInput from '$lib/components/OptionInput.svelte';
	import Results from '$lib/components/Results.svelte';
	import { setContext, onMount } from 'svelte';
	import { normalizeDimensionImportances, resultsCalc } from '$lib/utils';

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
		return normalizeDimensionImportances($dimensions);
	});

	$: results = derived(
		[options, normalizedDimensionImportances],
		([$options, $normalizedImportances]) => {
			return resultsCalc($options, $normalizedImportances);
		}
	);

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
				alert('You must enter an option to proceed');
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

<main class="container">
	<h1>Decision Maker</h1>

	<div class="step-container">
		{#if step === 1}
			<DimensionInput {newDimension} />
			<div class="right-hand-next-button">
				<button on:click={nextStep} data-testid="dimension-next-button">Next</button>
			</div>
		{:else if step === 2}
			<OptionInput {newOption} />
			<div class="button-group">
				<button on:click={prevStep} data-testid="option-back-button">Back</button>
				<button on:click={nextStep} data-testid="option-next-button">Next</button>
			</div>
		{:else}
			<Results results={$results} />
			<button on:click={prevStep} data-testid="result-back-button">Back</button>
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
