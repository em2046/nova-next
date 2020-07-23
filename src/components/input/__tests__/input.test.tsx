import { mount } from '@vue/test-utils';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaInput } from '../NovaInput';

describe('input', () => {
  test('render', () => {
    const wrapper = mount({
      setup() {
        return () => {
          return (
            <div>
              <NovaInput />
              <NovaInput disabled />
              <NovaInput readonly />
            </div>
          );
        };
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
