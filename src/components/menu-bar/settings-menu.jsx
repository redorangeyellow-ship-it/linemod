import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import LanguageMenu from './language-menu.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import MenuLabel from './tw-menu-label.jsx';
import TWAccentThemeMenu from './tw-theme-accent.jsx';
import TWGuiThemeMenu from './tw-theme-gui.jsx';
import TWBlocksThemeMenu from './tw-theme-blocks.jsx';
import TWDesktopSettings from './tw-desktop-settings.jsx';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';
import settingsIcon from './icon--settings.svg';

const BLOCKLY_BACKGROUND_IMAGE_STORAGE_KEY = 'tw:blocklyBackgroundImage';

const getBlocklyBackgroundImage = () => {
    try {
        return localStorage.getItem(BLOCKLY_BACKGROUND_IMAGE_STORAGE_KEY) || '';
    } catch (e) {
        return '';
    }
};

const setBlocklyBackgroundImage = imageUrl => {
    const cleanUrl = (imageUrl || '').trim();
    const cssValue = cleanUrl ? `url("${cleanUrl.replace(/"/g, '\\"')}")` : 'none';
    document.documentElement.style.setProperty('--tw-blockly-background-image', cssValue);
    document.documentElement.style.setProperty('--tw-blockly-background-color', cleanUrl ? '#ffffff' : '');

    try {
        if (cleanUrl) {
            localStorage.setItem(BLOCKLY_BACKGROUND_IMAGE_STORAGE_KEY, cleanUrl);
        } else {
            localStorage.removeItem(BLOCKLY_BACKGROUND_IMAGE_STORAGE_KEY);
        }
    } catch (e) {
        // Ignore storage quota or browser security issues.
    }
};

setBlocklyBackgroundImage(getBlocklyBackgroundImage());

const SettingsMenu = ({
    canChangeLanguage,
    canChangeTheme,
    isRtl,
    onClickDesktopSettings,
    onOpenCustomSettings,
    onRequestClose,
    onRequestOpen,
    settingsMenuOpen
}) => {
    const handleBackgroundImageClick = () => {
        const currentValue = getBlocklyBackgroundImage();
        // eslint-disable-next-line no-alert
        const nextValue = window.prompt(
            'Enter a background image URL for the block editor. Leave blank to clear it.',
            currentValue
        );
        if (nextValue === null) {
            return;
        }
        setBlocklyBackgroundImage(nextValue);
    };

    return (
        <MenuLabel
            open={settingsMenuOpen}
            onOpen={onRequestOpen}
            onClose={onRequestClose}
        >
            <img
                src={settingsIcon}
                draggable={false}
                width={20}
                height={20}
            />
            <span className={styles.dropdownLabel}>
                <FormattedMessage
                    defaultMessage="Settings"
                    description="Settings menu"
                    id="gui.menuBar.settings"
                />
            </span>
            <img
                src={dropdownCaret}
                draggable={false}
                width={8}
                height={5}
            />
            <MenuBarMenu
                className={menuBarStyles.menuBarMenu}
                open={settingsMenuOpen}
                place={isRtl ? 'left' : 'right'}
            >
                <MenuSection>
                    {canChangeLanguage && <LanguageMenu onRequestCloseSettings={onRequestClose} />}
                    {canChangeTheme && (
                        <React.Fragment>
                            <TWGuiThemeMenu />
                            <TWBlocksThemeMenu
                                onOpenCustomSettings={onOpenCustomSettings}
                            />
                            <TWAccentThemeMenu />
                        </React.Fragment>
                    )}
                    <MenuItem onClick={handleBackgroundImageClick}>
                        <div className={styles.option}>
                            <span className={styles.submenuLabel}>
                                <FormattedMessage
                                    defaultMessage="Set block background image..."
                                    description="Set the background image for the block editor"
                                    id="tw.menuBar.setBlockBackgroundImage"
                                />
                            </span>
                        </div>
                    </MenuItem>
                    {onClickDesktopSettings && <TWDesktopSettings onClick={onClickDesktopSettings} />}
                </MenuSection>
            </MenuBarMenu>
        </MenuLabel>
    );
};

SettingsMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickDesktopSettings: PropTypes.func,
    onOpenCustomSettings: PropTypes.func,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    settingsMenuOpen: PropTypes.bool
};

export default SettingsMenu;
