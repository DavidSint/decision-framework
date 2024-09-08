import { test, expect } from '@playwright/test';

test('has meta info', async ({ page }) => {
	await page.goto('http://localhost:4173/');

	await expect(page).toHaveTitle(/Decision Maker - Make Better Choices/);
	await expect(page.locator('meta[name="description"]')).toHaveAttribute(
		'content',
		'A powerful decision-making tool to help you make the best choices by comparing options across multiple dimensions.'
	);
	await expect(page.locator('meta[name="keywords"]')).toHaveAttribute(
		'content',
		'decision making, pro con, comparison tool, choice helper'
	);
});

test('runs through correctly', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await page.getByTestId('dimension-name-input').click();
	await page.getByTestId('dimension-name-input').fill('Dimension 1');
	await page.getByTestId('dimension-name-input').press('Tab');
	await page.getByTestId('dimension-importance-input').fill('1');
	await page.getByTestId('dimension-importance-input').press('Tab');
	await page.getByTestId('dimension-add-button').press('Enter');
	await page.getByTestId('dimension-name-input').click();
	await page.getByTestId('dimension-name-input').fill('Dimension 2');
	await page.getByTestId('dimension-importance-input').click();
	await page.getByTestId('dimension-importance-input').fill('10');
	await page.getByTestId('dimension-add-button').click();
	await page.getByTestId('dimension-name-input').click();
	await page.getByTestId('dimension-name-input').fill('Dimension 3');
	await page.getByTestId('dimension-importance-input').click();
	await page.getByTestId('dimension-importance-input').fill('100');
	await page.getByTestId('dimension-add-button').click();
	await page.getByTestId('dimension-next-button').click();
	await page.getByTestId('option-name-input').click();
	await page.getByTestId('option-name-input').fill('Option 1');
	await page.getByTestId('option-rating-i0-input').click();
	await page.getByTestId('option-rating-i0-input').fill('1');
	await page.getByTestId('option-rating-i0-input').press('Tab');
	await page.getByTestId('option-rating-i1-input').fill('2');
	await page.getByTestId('option-rating-i1-input').press('Tab');
	await page.getByTestId('option-rating-i2-input').fill('3');
	await page.getByTestId('option-rating-i2-input').press('Tab');
	await page.getByTestId('option-add-button').press('Enter');
	await page.getByTestId('option-name-input').click();
	await page.getByTestId('option-name-input').fill('Option 2');
	await page.getByTestId('option-rating-i0-input').click();
	await page.getByTestId('option-rating-i0-input').fill('10');
	await page.getByTestId('option-rating-i0-input').press('Tab');
	await page.getByTestId('option-rating-i1-input').fill('20');
	await page.getByTestId('option-rating-i1-input').press('Tab');
	await page.getByTestId('option-rating-i2-input').fill('30');
	await page.getByTestId('option-add-button').click();
	await page.getByTestId('option-name-input').click();
	await page.getByTestId('option-name-input').fill('Option 3');
	await page.getByTestId('option-rating-i0-input').click();
	await page.getByTestId('option-rating-i0-input').fill('100');
	await page.getByTestId('option-rating-i1-input').click();
	await page.getByTestId('option-rating-i1-input').fill('200');
	await page.getByTestId('option-rating-i2-input').click();
	await page.getByTestId('option-rating-i2-input').fill('300');
	await page.getByTestId('option-add-button').click();
	await page.getByTestId('option-next-button').click();

	await expect(page.getByTestId('Option 3-score-text')).toContainText('90.09');
	await expect(page.getByTestId('Option 2-score-text')).toContainText('9.01');
	await expect(page.getByTestId('Option 1-score-text')).toContainText('0.90');
	await expect(page.getByTestId('winner-text')).toContainText('Option 3 with a score of 90.09');
});

test('navigates correctly', async ({ page }) => {
	await page.goto('http://localhost:4173/');
	await expect(page.getByTestId('dimensions-title')).toContainText('Enter Dimensions');

	await page.getByTestId('dimension-name-input').click();
	await page.getByTestId('dimension-name-input').fill('Dimension');
	await page.getByTestId('dimension-importance-input').click();
	await page.getByTestId('dimension-importance-input').fill('1');
	await page.getByTestId('dimension-add-button').click();
	await page.getByTestId('dimension-next-button').click();
	await expect(page.getByTestId('options-title')).toContainText('Enter Options');

	await page.getByTestId('option-name-input').click();
	await page.getByTestId('option-name-input').fill('Option');
	await page.getByTestId('option-rating-i0-input').click();
	await page.getByTestId('option-rating-i0-input').fill('1');
	await page.getByTestId('option-add-button').press('Enter');
	await page.getByTestId('option-next-button').click();
	await expect(page.getByTestId('results-title')).toContainText('Results');

	await page.getByTestId('result-back-button').click();
	await expect(page.getByTestId('options-title')).toContainText('Enter Options');

	await page.getByTestId('option-back-button').click();
	await expect(page.getByTestId('dimensions-title')).toContainText('Enter Dimensions');
});

test('alert and confirmation dialogs work correctly', async ({ page }) => {
	await page.goto('http://localhost:4173/');

	page.once('dialog', async (dialog) => {
		const message = dialog.message();
		expect(message).toBe('You must enter a dimension to proceed');
		await dialog.dismiss();
	});
	await page.getByTestId('dimension-next-button').click();

	await page.getByTestId('dimension-name-input').click();
	await page.getByTestId('dimension-name-input').fill('Dimension');
	await page.getByTestId('dimension-importance-input').click();
	await page.getByTestId('dimension-importance-input').fill('1');
	page.once('dialog', async (dialog) => {
		const message = dialog.message();
		expect(message).toBe(
			'You have unsaved dimensions.\nClick OK if you would like to proceed anyway, or Cancel if you want to add your unadded dimension.'
		);
		await dialog.accept();
	});
	await page.getByTestId('dimension-next-button').click();
	await page.getByTestId('dimension-add-button').click();
	await page.getByTestId('dimension-next-button').click();

	page.once('dialog', async (dialog) => {
		const message = dialog.message();
		expect(message).toBe('You must enter an option to proceed');
		await dialog.dismiss();
	});
	await page.getByTestId('option-next-button').click();

	await page.getByTestId('option-name-input').click();
	await page.getByTestId('option-name-input').fill('Option');
	await page.getByTestId('option-rating-i0-input').click();
	await page.getByTestId('option-rating-i0-input').fill('1');
	page.once('dialog', async (dialog) => {
		const message = dialog.message();
		expect(message).toBe(
			'You have an unsaved option.\nClick OK if you would like to proceed anyway, or Cancel if you want to add your unsaved options.'
		);
		await dialog.accept();
	});
	await page.getByTestId('option-next-button').click();

	await page.getByTestId('option-add-button').click();
	await page.getByTestId('option-next-button').click();
	await expect(page.getByTestId('results-title')).toContainText('Results');
});
