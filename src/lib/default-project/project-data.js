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
                        assetId: '78f1c8994065bafc771e04e2af4f7453',
                        md5ext: '78f1c8994065bafc771e04e2af4f7453.svg',
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
                        assetId: 'b99737d68636c6ec581e7e3c223a9bdb',
                        md5ext: 'b99737d68636c6ec581e7e3c223a9bdb.svg',
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
            }
        ],
        monitors: [],
        extensions: [],
        meta: {
            semver: '3.0.0',
            vm: '0.2.0',
            agent: '',
            platform: {
                name: 'TurboWarp',
                url: 'https://turbowarp.org/'
            }
        }
    });
};

export default projectData;
