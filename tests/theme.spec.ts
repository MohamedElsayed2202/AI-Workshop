import { test, expect, type Page } from '@playwright/test'

/**
 * The toggle must repaint the app immediately. It regressed once because the
 * button and ThemeRoot each held their own copy of the preference, so the new
 * colours only appeared after a reload.
 */

async function signIn(page: Page) {
	await page.goto('/')

	// The login gate is on unless VITE_AUTH_ENABLED=false, so wait for whichever
	// of the two landing screens renders before deciding to sign in.
	const signInButton = page.getByRole('button', { name: 'Sign in' })
	const dashboardLink = page.getByTestId('nav-dashboard')
	await expect(signInButton.or(dashboardLink).first()).toBeVisible()

	if (await signInButton.isVisible()) {
		await page.getByLabel('Username').fill('root')
		await page.getByLabel('Password').fill('root')
		await signInButton.click()
	}
	await expect(dashboardLink).toBeVisible()
}

function averageChannel(color: string): number {
	const channels = color.match(/\d+/g)?.map(Number) ?? []
	return channels.slice(0, 3).reduce((total, channel) => total + channel, 0) / 3
}

async function appBackground(page: Page): Promise<string> {
	return page.evaluate(() => {
		const themeRoot = document.querySelector('#root > div')
		if (!themeRoot) throw new Error('ThemeRoot is not mounted')
		return getComputedStyle(themeRoot).backgroundColor
	})
}

test.describe('theme toggle', () => {
	test('switches the whole app between light and dark without a reload', async ({ page }) => {
		await signIn(page)
		const toggle = page.getByRole('button', { name: /Switch to (light|dark) theme/ })

		expect(averageChannel(await appBackground(page))).toBeGreaterThan(128)

		await toggle.click()
		await expect(toggle).toHaveAttribute('aria-pressed', 'true')
		await expect.poll(async () => averageChannel(await appBackground(page))).toBeLessThan(128)

		await toggle.click()
		await expect(toggle).toHaveAttribute('aria-pressed', 'false')
		await expect.poll(async () => averageChannel(await appBackground(page))).toBeGreaterThan(128)
	})

	test('remembers the choice across a reload', async ({ page }) => {
		await signIn(page)
		await page.getByRole('button', { name: 'Switch to dark theme' }).click()

		await page.reload()
		await expect(page.getByTestId('nav-dashboard')).toBeVisible()

		expect(averageChannel(await appBackground(page))).toBeLessThan(128)
		await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()
	})
})
