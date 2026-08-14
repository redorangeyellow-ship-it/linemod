/* eslint-env jest */
import reducer, {changeRoundedRectRadius} from '../../../node_modules/scratch-paint/src/reducers/rounded-rect-radius';

test('initial state is 10', () => {
    expect(reducer(undefined, {type: 'anything'})).toBe(10);
});

test('updates rounded rectangle radius value', () => {
    expect(reducer(10, changeRoundedRectRadius(20))).toBe(20);
    expect(reducer(10, changeRoundedRectRadius(-2))).toBe(0);
    expect(reducer(10, changeRoundedRectRadius(200))).toBe(100);
});
