// @vitest-environment happy-dom
import { readFileSync } from 'node:fs'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { getColorScheme } from '../src/utils/utils'

beforeAll(() => {
    const style = document.createElement('style')
    style.textContent = ['../src/style.css', '../src/ui/Dialog.css']
        .map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n')
    document.head.append(style)
})

afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('class')
    document.documentElement.removeAttribute('style')
    document.body.innerHTML = ''
    vi.restoreAllMocks()
})

describe.each(['class', 'data-theme'])('ui colors with %s themes', (attribute) => {
    it.each(['light', 'dark'])('renders the %s menu and dialogs', (theme) => {
        document.documentElement.setAttribute(attribute, theme)
        document.body.innerHTML = `
            <div class="ce-card bg-menu"></div>
            <div class="DialogContent _export">
                <h2 class="DialogTitle">Export</h2>
                <input class="Input">
            </div>
        `
        const color = (selector: string, property: 'color' | 'backgroundColor') =>
            getComputedStyle(document.querySelector(selector)!)[property]

        const dark = theme === 'dark'
        expect(color('.ce-card', 'backgroundColor')).toBe(dark ? '#2A2A2A' : '#ffffff')
        expect(color('.ce-card', 'color')).toBe(dark ? '#ececec' : '#0d0d0d')
        expect(color('.DialogContent', 'backgroundColor')).toBe(dark ? '#2a2a2a' : '#ffffff')
        expect(color('.DialogTitle', 'color')).toBe(dark ? '#fff' : '#1a1523')
        expect(color('.Input', 'backgroundColor')).toBe(dark ? '#2f2f2f' : '#fafafa')
    })
})

describe('getColorScheme', () => {
    it.each(['light', 'dark'] as const)('reads the redesigned %s theme', (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        expect(getColorScheme()).toBe(theme)
    })

    it.each(['light', 'dark'] as const)('retains the legacy %s class', (theme) => {
        document.documentElement.className = theme
        expect(getColorScheme()).toBe(theme)
    })

    it.each(['light', 'dark'] as const)('retains the legacy inline %s scheme', (theme) => {
        document.documentElement.style.colorScheme = theme
        expect(getColorScheme()).toBe(theme)
    })

    it('follows theme changes without caching the previous value', () => {
        document.documentElement.dataset.theme = 'dark'
        expect(getColorScheme()).toBe('dark')
        document.documentElement.dataset.theme = 'light'
        expect(getColorScheme()).toBe('light')
    })

    it('prefers the explicit site theme over the system preference', () => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
        document.documentElement.dataset.theme = 'light'
        expect(getColorScheme()).toBe('light')
    })

    it.each([false, true])('uses the system preference when no site theme is set (%s)', (matches) => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches } as MediaQueryList)
        expect(getColorScheme()).toBe(matches ? 'dark' : 'light')
    })
})
