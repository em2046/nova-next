import { h, VNode, reactive, defineComponent } from 'vue';
import { NovaColorPicker } from '../../components/color-picker';

export default defineComponent({
  setup() {
    const color1Default = '#ffff00';
    const color2Default = '#ffff0080';

    const state = reactive({
      color1: color1Default,
      color2: color2Default,
    });

    function onColor1Update(color1: string): void {
      state.color1 = color1;
    }

    function onColor1Reset(): void {
      state.color1 = color1Default;
    }

    function onColor2Update(color2: string): void {
      state.color2 = color2;
    }

    function onColor2Reset(): void {
      state.color2 = color2Default;
    }

    return (): VNode[] => [
      h('section', [
        h('div', [
          state.color1,
          h('button', { onClick: onColor1Reset }, ['reset']),
        ]),
        h(NovaColorPicker, { value: state.color1, onUpdate: onColor1Update }),
        h('div', [
          state.color2,
          h('button', { onClick: onColor2Reset }, ['reset']),
        ]),
        h(NovaColorPicker, {
          value: state.color2,
          onUpdate: onColor2Update,
          teleportToBody: false,
        }),
      ]),
    ];
  },
});
