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

        return (): JSX.Element => {
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

  test('change value', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#ff0000',
        });

        function onUpdate(value: string): void {
          state.color = value;
        }

        return (): JSX.Element => (
          <div>
            <span id="print">{state.color}</span>
            <NovaColorPicker
              value={state.color}
              onUpdate={onUpdate}
              teleportToBody={false}
            />
          </div>
        );
      },
    });

    const print = wrapper.find('#print');
    expect(print.text()).toEqual('#ff0000');

    const pickerTrigger = wrapper.find('.nova-color-picker-trigger');
    await pickerTrigger.trigger('click');
    const pickerValue = wrapper.find('.nova-color-picker-value');
    await pickerValue.trigger('mousedown', {
      pageX: 100,
      pageY: 100,
    });
    await pickerValue.trigger('mouseup');
    expect(wrapper.html()).toMatchSnapshot();

    await pickerTrigger.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
    expect(print.text()).toEqual('#804040');
  });

  test('disabled', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#ff0000',
          disabled: true,
        });

        function onUpdate(value: string): void {
          state.color = value;
        }

        function toggleDisabled(): void {
          state.disabled = !state.disabled;
        }

        return (): JSX.Element => (
          <div>
            <button id="toggle" onClick={toggleDisabled} />
            <NovaColorPicker
              value={state.color}
              disabled={state.disabled}
              onUpdate={onUpdate}
              teleportToBody={false}
            />
          </div>
        );
      },
    });

    const pickerTrigger = wrapper.find('.nova-color-picker-trigger');
    await pickerTrigger.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();

    const classListBefore = wrapper.find('.nova-color-picker').classes();
    expect(classListBefore).toContain('nova-color-picker-disabled');

    await wrapper.find('#toggle').trigger('click');
    await pickerTrigger.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();

    const classListAfter = wrapper.find('.nova-color-picker').classes();
    expect(classListAfter).not.toContain('nova-color-picker-disabled');
  });
});
