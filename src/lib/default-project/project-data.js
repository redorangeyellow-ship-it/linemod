import {defineMessages} from 'react-intl';
import sharedMessages from '../shared-messages';

let messages = defineMessages({
    variable: {
        defaultMessage: 'my variable',
        description: 'Name for the default variable',
        id: 'gui.defaultProject.variable'
    }
});

messages = {...messages, ...sharedMessages};

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {
                    '`jEk@4|i[#Fk?(8x)AV.-my variable': [
                        translator(messages.variable),
                        0
                    ]
                },
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        name: 'chicken',
                        bitmapResolution: 1,
                        dataFormat: 'svg',
                        assetId: '91223aa32e565265e90daf5e427a5795',
                        md5ext: '91223aa32e565265e90daf5e427a5795.svg',
                        rotationCenterX: 0,
                        rotationCenterY: 0
                    }
                ],
                sounds: [],
                volume: 100,
                layerOrder: 0,
                tempo: 60,
                videoTransparency: 50,
                videoState: 'on',
                textToSpeechLanguage: null
            },
            {
                isStage: false,
                name: 'Sprite1',
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        name: 'Chicken',
                        bitmapResolution: 1,
                        dataFormat: 'svg',
                        assetId: '36feff3c05d97b28d4dae8cd7b31cd3b',
                        md5ext: '36feff3c05d97b28d4dae8cd7b31cd3b.svg',
                        rotationCenterX: 83,
                        rotationCenterY: 89.22499874000435
                    }
                ],
                sounds: [],
                volume: 100,
                layerOrder: 1,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            },
            {
                isStage: false,
                name: 'Sprite2',
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        name: 'Chicken',
                        bitmapResolution: 1,
                        dataFormat: 'svg',
                        assetId: '36feff3c05d97b28d4dae8cd7b31cd3b',
                        md5ext: '36feff3c05d97b28d4dae8cd7b31cd3b.svg',
                        rotationCenterX: 83,
                        rotationCenterY: 89.22499874000435
                    }
                ],
                sounds: [],
                volume: 100,
                layerOrder: 2,
                visible: true,
                x: 120,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            }
        ],
        monitors: [],
        extensions: [],
        meta: {
            semver: '3.0.0',
            vm: '15.0.2-revert-react-context-menu-static-init.1',
            agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            platform: {
                name: 'TurboWarp',
                url: 'https://turbowarp.org/'
            }
        }
    });
};

export default projectData;
