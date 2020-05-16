import { defineComponent, h, reactive, VNode } from 'vue';
import { NovaColorPicker } from '../../components/color-picker';

function getRandomNumber(low = 0, high = 100): number {
  return Math.floor(Math.random() * (high - low) + low);
}

export default defineComponent({
  setup() {
    const color1Default = '#ffff00';
    const color2Default = '#ffff0080';

    const state = reactive({
      color1: color1Default,
      color1Disabled: false,
      color2: color2Default,
      color2CustomValue: getRandomNumber(),
      color2DropdownClass: 'custom-dropdown-class-name' + getRandomNumber(),
      color2DropdownStyle: {
        background: '#000000',
      },
    });

    function onColor1Update(color1: string): void {
      state.color1 = color1;
    }

    function onColor1Reset(): void {
      state.color1 = color1Default;
    }

    function onColor1ToggleDisable(): void {
      state.color1Disabled = !state.color1Disabled;
    }

    function onColor2Update(color2: string): void {
      state.color2 = color2;
    }

    function onColor2Reset(): void {
      state.color2 = color2Default;
    }

    function getColorChannel(): string {
      return `${getRandomNumber(0, Math.floor(0xff / 2))
        .toString(16)
        .padStart(2, '0')}`;
    }

    function onColor2Click(): void {
      state.color2CustomValue = getRandomNumber();
      state.color2DropdownClass =
        'custom-dropdown-class-name-' + getRandomNumber();
    }

    function onColor2OpenChange(open: boolean): void {
      console.log(open);
      state.color2DropdownStyle = {
        background: `#${getColorChannel()}${getColorChannel()}${getColorChannel()}`,
      };
    }

    return (): VNode[] => [
      h('section', [
        h('div', [
          state.color1,
          h('button', { onClick: onColor1Reset }, ['Reset']),
          h('button', { onClick: onColor1ToggleDisable }, ['Toggle disable']),
        ]),
        h(NovaColorPicker, {
          value: state.color1,
          disabled: state.color1Disabled,
          onUpdate: onColor1Update,
        }),
        h('div', [
          state.color2,
          h('button', { onClick: onColor2Reset }, ['Reset']),
        ]),
        h(NovaColorPicker, {
          value: state.color2,
          onUpdate: onColor2Update,
          onClick: onColor2Click,
          onOpenChange: onColor2OpenChange,
          teleportToBody: false,
          dropdownClass: [state.color2DropdownClass],
          dropdownStyle: state.color2DropdownStyle,
          class: 'custom-class-name',
          style: { background: '#333333' },
          ['data-custom']: state.color2CustomValue,
        }),
      ]),
    ];
  },
});
