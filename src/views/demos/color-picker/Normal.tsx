import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaButton, NovaColorPicker } from '../../../index';

export default defineComponent({
  setup() {
    const defaultColor = '#808040';

    const state = reactive({
      color: defaultColor,
      disabled: false,
    });

    function onUpdate(color: string): void {
      state.color = color;
    }

    function onReset(): void {
      state.color = defaultColor;
    }

    function onToggleDisable(): void {
      state.disabled = !state.disabled;
    }

    return (): JSX.Element => {
      const pickerProps = {
        value: state.color,
        disabled: state.disabled,
        onUpdate,
        preset: [
          '#804040',
          '#808040',
          '#408040',
          '#408080',
          '#404080',
          '#804080',
          '#808080',
        ],
      };

      return (
        <div>
          <div>
            {state.color}
            <NovaButton onClick={onReset}>{() => 'Reset'}</NovaButton>
            <NovaButton onClick={onToggleDisable}>
              {() => 'Toggle disable'}
            </NovaButton>
          </div>
          <NovaColorPicker {...pickerProps} />
        </div>
      );
    };
  },
});
