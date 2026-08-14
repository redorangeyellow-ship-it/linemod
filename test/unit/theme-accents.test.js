import {ACCENT_GREEN, ACCENT_MAP, Theme} from '../../src/lib/themes/index.js';

describe('accent theme definitions', () => {
    test('green is exposed and red is not rainbow', () => {
        expect(ACCENT_MAP.green).toBeDefined();
        expect(new Theme(ACCENT_GREEN, 'light', 'three').accent).toBe(ACCENT_GREEN);
        expect(ACCENT_MAP.red.guiColors['menu-bar-background-image']).toBeUndefined();
        expect(ACCENT_MAP.rainbow.guiColors['menu-bar-background-image']).toContain('linear-gradient');
        expect(ACCENT_MAP.red.guiColors).not.toEqual(ACCENT_MAP.rainbow.guiColors);
    });
});
