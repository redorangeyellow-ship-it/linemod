import {
    addCustomTag,
    normalizeCustomSpriteLibraryItem,
    readCustomSpriteLibrary,
    saveCustomSpriteLibrary
} from '../../../src/lib/libraries/custom-sprite-library';

describe('custom sprite library', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test('adds the custom tag and persists a sprite item', () => {
        const sprite = {
            isStage: false,
            name: 'Buddy',
            tags: ['animals'],
            costumes: [],
            sounds: [],
            blocks: {},
            variables: {},
            lists: {},
            broadcasts: {},
            comments: {},
            currentCostumeIndex: 0,
            volume: 100,
            visible: true,
            x: 0,
            y: 0,
            size: 100,
            direction: 90,
            draggable: false,
            rotationStyle: 'all around'
        };

        const normalized = normalizeCustomSpriteLibraryItem(sprite);
        expect(normalized.tags).toContain('custom');

        saveCustomSpriteLibrary([normalized]);
        expect(readCustomSpriteLibrary()).toHaveLength(1);
        expect(readCustomSpriteLibrary()[0].tags).toContain('custom');
    });

    test('adds custom tag to a sprite without tags array', () => {
        const sprite = {
            isStage: false,
            name: 'Chicken',
            costumes: [],
            sounds: [],
            blocks: {},
            variables: {},
            lists: {},
            broadcasts: {},
            comments: {}
        };

        expect(addCustomTag(sprite).tags).toEqual(['custom']);
    });
});
