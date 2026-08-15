const CUSTOM_SPRITE_LIBRARY_STORAGE_KEY = 'tw:custom-sprite-library';

const normalizeTags = tags => {
    if (!Array.isArray(tags)) return [];
    return tags
        .map(tag => String(tag))
        .map(tag => tag.trim())
        .filter(Boolean)
        .map(tag => tag.toLowerCase());
};

export const addCustomTag = item => {
    if (!item || typeof item !== 'object') {
        return item;
    }

    const tags = normalizeTags(item.tags);
    const nextTags = tags.includes('custom') ? tags : [...tags, 'custom'];
    return {
        ...item,
        tags: nextTags
    };
};

export const normalizeCustomSpriteLibraryItem = item => {
    if (!item || typeof item !== 'object') {
        return item;
    }

    const normalized = addCustomTag({...item});
    if (!normalized.name) {
        normalized.name = 'Custom Sprite';
    }
    return normalized;
};

export const readCustomSpriteLibrary = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(CUSTOM_SPRITE_LIBRARY_STORAGE_KEY));
        if (!Array.isArray(stored)) {
            return [];
        }
        return stored
            .map(normalizeCustomSpriteLibraryItem)
            .filter(item => item && item.name);
    } catch (error) {
        return [];
    }
};

export const saveCustomSpriteLibrary = items => {
    const normalized = Array.isArray(items) ? items.map(normalizeCustomSpriteLibraryItem) : [];
    try {
        localStorage.setItem(CUSTOM_SPRITE_LIBRARY_STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {
        // ignore storage write failures
    }
    return normalized;
};

export const addCustomSpriteLibraryItem = item => {
    const normalized = normalizeCustomSpriteLibraryItem(item);
    const current = readCustomSpriteLibrary();
    const next = current.some(existing => String(existing.name || '').toLowerCase() === String(normalized.name || '').toLowerCase()) ?
        current : [...current, normalized];
    return saveCustomSpriteLibrary(next);
};

export const removeCustomSpriteLibraryItem = item => {
    const targetName = item && item.name ? String(item.name).toLowerCase() : '';
    const next = readCustomSpriteLibrary().filter(existing => (
        !targetName || String(existing.name || '').toLowerCase() !== targetName
    ));
    return saveCustomSpriteLibrary(next);
};

export const getCustomSpriteLibrary = () => readCustomSpriteLibrary();

export default {
    addCustomSpriteLibraryItem,
    addCustomTag,
    getCustomSpriteLibrary,
    normalizeCustomSpriteLibraryItem,
    readCustomSpriteLibrary,
    removeCustomSpriteLibraryItem,
    saveCustomSpriteLibrary
};
