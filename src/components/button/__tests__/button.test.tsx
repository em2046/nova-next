import { mount } from '@vue/test-utils';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaButton } from '../NovaButton';

describe('button', () => {
  test('render', () => {
    const wrapper = mount({
      setup() {
        return () => {
          return (
            <div>
              <NovaButton>{() => 'Button'}</NovaButton>
              <NovaButton primary>{() => 'Primary'}</NovaButton>
              <NovaButton disabled>{() => 'Disabled'}</NovaButton>
            </div>
          );
        };
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
