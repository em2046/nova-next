import { mount } from '@vue/test-utils';
import NovaColorPicker from '../NovaColorPicker';
import { reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';

describe('color-picker', () => {
  test('render', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#80808080',
        });

        return (): unknown => {
          return (
            <div>
              <NovaColorPicker
                value={state.color}
                alpha={true}
                teleportToBody={false}
              />
            </div>
          );
        };
      },
    });
    expect(wrapper.html()).toMatchSnapshot();

    await wrapper.find('.nova-color-picker-trigger').trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
