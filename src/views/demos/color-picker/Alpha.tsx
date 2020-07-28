import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaButton, NovaColorPicker } from '../../../index';
import { ColorFormat } from '../../../components/color-picker/color';

const hex = [
  '#80404080',
  '#80804080',
  '#40804080',
  '#40808080',
  '#40408080',
  '#80408080',
  '#80808080',
];
const rgb = [
  'rgb(100%,  0%,  0%)',
  'rgb(100%,100%,  0%)',
  'rgb(  0%,100%,  0%)',
  'rgb(  0%,100%,100%)',
  'rgb(  0%,  0%,100%)',
  'rgb(100%,  0%,100%)',
  'rgb(100%,100%,100%)',
];
const rgba = [
  'rgba(255,  0,  0,0.5)',
  'rgba(255,255,  0,0.5)',
  'rgba(  0,255,  0,0.5)',
  'rgba(  0,255,255,0.5)',
  'rgba(  0,  0,255,0.5)',
  'rgba(255,  0,255,0.5)',
  'rgba(255,255,255,0.5)',
  'rgba(  0,  0,  0,0.5)',
];
const hsl = [
  'hsl(0,  100%,50%)',
  'hsl(30, 100%,50%)',
  'hsl(60, 100%,50%)',
  'hsl(90, 100%,50%)',
  'hsl(120,100%,50%)',
  'hsl(150,100%,50%)',
  'hsl(180,100%,50%)',
  'hsl(210,100%,50%)',
  'hsl(240,100%,50%)',
  'hsl(270,100%,50%)',
  'hsl(300,100%,50%)',
  'hsl(330,100%,50%)',
  'hsl(360,100%,50%)',
];
const hsla = [
  'hsla(240,100%,50%,0.05)',
  'hsla(240,100%,50%, 0.4)',
  'hsla(240,100%,50%, 0.7)',
  'hsla(240,100%,50%,   1)',
];
const preset = [...hex, ...rgb, ...rgba, ...hsl, ...hsla];

function getRandomNumber(low = 0, high = 100): number {
  return Math.floor(Math.random() * (high - low) + low);
}

export default defineComponent({
  setup() {
    const defaultColor = 'rgba(128, 128, 64, 0.5)';

    const state = reactive({
      color: defaultColor,
      alpha: true,
      colorCustomValue: getRandomNumber(),
      colorPanelClass: 'custom-panel-class-name-' + getRandomNumber(),
    });

    function onUpdate(color: string): void {
      state.color = color;
    }

    function onReset(): void {
      state.color = defaultColor;
    }

    function toggleAlpha(): void {
      state.alpha = !state.alpha;
    }

    function onClick(): void {
      state.colorCustomValue = getRandomNumber();
      state.colorPanelClass = 'custom-panel-class-name-' + getRandomNumber();
    }

    function onOpenChange(open: boolean): void {
      console.log(open);
    }

    return (): JSX.Element => {
      const pickerProps = {
        format: 'rgb' as ColorFormat,
        alpha: state.alpha,
        value: state.color,
        onUpdate,
        onClick,
        onOpenChange,
        teleportToBody: false,
        panelClass: [state.colorPanelClass],
        panelStyle: { borderRadius: '0' },
        panelProps: {
          'data-custom': getRandomNumber(),
        },
        class: 'custom-class-name',
        style: { margin: '10px' },
        ['data-custom']: state.colorCustomValue,
        preset,
      };

      return (
        <div>
          <div>
            {state.color}
            <NovaButton onClick={onReset}>{() => 'Reset'}</NovaButton>
            <NovaButton onClick={toggleAlpha}>
              {() => 'Toggle alpha'}
            </NovaButton>
          </div>
          <NovaColorPicker {...pickerProps} />
        </div>
      );
    };
  },
});
