import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { Color, NovaButton, NovaColorPicker } from '../../../index';
import styles from './styles/normal.module.css';
import { PresetScoped } from '../../../components/color-picker/NovaColorPicker';
import hslData from '../../../components/color-picker/assets/css-wg/hsl';

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

    const slots = {
      preset: (scoped: PresetScoped) => {
        function handleClick(cell: string) {
          scoped.setColorAndPosition(Color.fromHex(cell));
        }

        const panes = hslData.map((pane) => {
          const table = pane.slice(2, -1).map((row) => {
            const list = row.slice(1).map((cell) => {
              return (
                <li
                  class={{
                    [`${styles.selected}`]:
                      scoped.color.toCssHexString() === cell,
                  }}
                  onClick={() => handleClick(cell)}
                  style={{ backgroundColor: cell }}
                />
              );
            });

            return <ul>{list}</ul>;
          });
          return <div class={styles.pane}>{table}</div>;
        });

        return <div class={styles.preset}>{panes}</div>;
      },
    };

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
          <NovaColorPicker {...pickerProps}>{slots}</NovaColorPicker>
        </div>
      );
    };
  },
});
