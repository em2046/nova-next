import { mount } from '@vue/test-utils';
import NovaColorPicker from '../NovaColorPicker';
import { h, VNode } from 'vue';

describe('color-picker', () => {
  test('render', () => {
    const wrapper = mount({
      setup() {
        return (): VNode => {
          return h('div', [h(NovaColorPicker)]);
        };
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
