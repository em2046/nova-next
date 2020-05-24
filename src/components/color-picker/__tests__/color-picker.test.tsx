import { mount } from '@vue/test-utils';
import NovaColorPicker from '../NovaColorPicker';
import { reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import DomUtils from '../../../utils/dom-utils';

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
          color: '#808080',
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
    expect(print.text()).toEqual('#808080');

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
          color: '#808080',
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

  test('class', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#808080',
        });

        const classList = [
          'array-class',
          {
            ['object-class']: true,
          },
        ];
        const dropdownClassList = [
          'array-dropdown-class',
          {
            ['object-dropdown-class']: true,
          },
        ];

        return () => {
          return (
            <div>
              <NovaColorPicker
                value={state.color}
                class={classList}
                dropdownClass={dropdownClassList}
                teleportToBody={false}
              />
            </div>
          );
        };
      },
    });

    const classList = wrapper.find('.nova-color-picker').classes();
    expect(classList).toContain('array-class');
    expect(classList).toContain('object-class');

    await wrapper.find('.nova-color-picker-trigger').trigger('click');
    const dropdownClassList = wrapper
      .find('.nova-color-picker-panel')
      .classes();
    expect(dropdownClassList).toContain('array-dropdown-class');
    expect(dropdownClassList).toContain('object-dropdown-class');
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('style', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#808080',
        });

        const style = {
          backgroundColor: '#808080',
        };
        const dropdownStyle = {
          backgroundColor: '#808080',
        };

        return () => {
          return (
            <div>
              <NovaColorPicker
                value={state.color}
                style={style}
                dropdownStyle={dropdownStyle}
                teleportToBody={false}
              />
            </div>
          );
        };
      },
    });

    const picker = wrapper.find('.nova-color-picker');
    const bg = DomUtils.getStyleOf(
      picker.element as HTMLElement,
      'background-color'
    );
    expect(bg).toEqual('rgb(128, 128, 128)');

    await wrapper.find('.nova-color-picker-trigger').trigger('click');
    const panel = wrapper.find('.nova-color-picker-panel');
    const dropdownBg = DomUtils.getStyleOf(
      panel.element as HTMLElement,
      'background-color'
    );
    expect(dropdownBg).toEqual('rgb(128, 128, 128)');
  });

  test('teleport to body', async () => {
    const wrapper = mount({
      setup() {
        const state = reactive({
          color: '#80808080',
          teleport: true,
        });

        function toggleTeleport() {
          state.teleport = !state.teleport;
        }

        return (): JSX.Element => {
          return (
            <div>
              <button id="toggle" onClick={toggleTeleport} />
              <NovaColorPicker
                value={state.color}
                alpha={true}
                teleportToBody={state.teleport}
              />
            </div>
          );
        };
      },
    });

    const trigger = wrapper.find('.nova-color-picker-trigger');
    await trigger.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();

    await trigger.trigger('click');
    await wrapper.find('#toggle').trigger('click');
    await trigger.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
