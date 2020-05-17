import { defineComponent, h, reactive, VNode } from 'vue';
import { NovaColorPicker } from '../../..';

function getRandomNumber(low = 0, high = 100): number {
  return Math.floor(Math.random() * (high - low) + low);
}

export default defineComponent({
  setup() {
    const colorDefault = '#ffff0080';

    const state = reactive({
      color: colorDefault,
      colorCustomValue: getRandomNumber(),
      colorDropdownClass: 'custom-dropdown-class-name' + getRandomNumber(),
    });

    function onColorUpdate(color: string): void {
      state.color = color;
    }

    function onColorReset(): void {
      state.color = colorDefault;
    }

    function onColorClick(): void {
      state.colorCustomValue = getRandomNumber();
      state.colorDropdownClass =
        'custom-dropdown-class-name-' + getRandomNumber();
    }

    function onColor2OpenChange(open: boolean): void {
      console.log(open);
    }

    return (): VNode => {
      return h('div', {}, [
        h('div', [
          state.color,
          h('button', { onClick: onColorReset }, ['Reset']),
        ]),
        h(NovaColorPicker, {
          alpha: true,
          value: state.color,
          onUpdate: onColorUpdate,
          onClick: onColorClick,
          onOpenChange: onColor2OpenChange,
          teleportToBody: false,
          dropdownClass: [state.colorDropdownClass],
          class: 'custom-class-name',
          style: { background: '#333333' },
          ['data-custom']: state.colorCustomValue,
          preset: [
            '#80404080',
            '#80804080',
            '#40804080',
            '#40808080',
            '#40408080',
            '#80408080',
            '#80808080',
            'rgb(100%,  0%,  0%)',
            'rgb(100%,100%,  0%)',
            'rgb(  0%,100%,  0%)',
            'rgb(  0%,100%,100%)',
            'rgb(  0%,  0%,100%)',
            'rgb(100%,  0%,100%)',
            'rgb(100%,100%,100%)',
            'rgba(255,  0,  0,0.5)',
            'rgba(255,255,  0,0.5)',
            'rgba(  0,255,  0,0.5)',
            'rgba(  0,255,255,0.5)',
            'rgba(  0,  0,255,0.5)',
            'rgba(255,  0,255,0.5)',
            'rgba(255,255,255,0.5)',
            'rgba(  0,  0,  0,0.5)',
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
            'hsla(240,100%,50%,0.05)',
            'hsla(240,100%,50%, 0.4)',
            'hsla(240,100%,50%, 0.7)',
            'hsla(240,100%,50%,   1)',
          ],
        }),
      ]);
    };
  },
});
