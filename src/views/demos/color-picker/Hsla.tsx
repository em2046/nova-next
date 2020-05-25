import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaColorPicker } from '../../../index';

export default defineComponent({
  setup() {
    const defaultColor = 'hsla(180, 50%, 50%, 0.5)';
    const state = reactive({
      color: defaultColor,
    });

    function onReset(): void {
      state.color = defaultColor;
    }

    function onUpdate(color: string): void {
      state.color = color;
    }

    return (): JSX.Element => {
      const pickerProps = {
        value: state.color,
        format: 'hsl',
        alpha: true,
        onUpdate,
      };

      return (
        <div>
          <div>
            {state.color}
            <button onClick={onReset}>Reset</button>
          </div>
          <NovaColorPicker {...pickerProps} />
        </div>
      );
    };
  },
});
