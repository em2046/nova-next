import { mount } from '@vue/test-utils';
import NovaColorPicker from '../NovaColorPicker';
import { h, reactive, VNode } from 'vue';

describe('color-picker', () => {
  test('render', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#80808080',
        });
        return (): VNode => {
          return h('div', [
            h(NovaColorPicker, {
              value: state.color,
              teleportToBody: false,
            }),
          ]);
        };
      },
    });
    expect(wrapper.html()).toMatchSnapshot();

    await wrapper.find('.nova-color-picker-trigger').trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
