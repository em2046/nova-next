import { defineComponent, h, Ref, ref, VNode } from 'vue';
import Color from '../../color';
import DomUtils from '../../../../utils/dom-utils';
import { getAlphaValue, getIntValue } from './label-utils';

interface ChannelParams {
  channelRef: Ref<HTMLElement | null>;
  label: string;
  value: number;
  onInput: (e: InputEvent) => void;
}

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const hRef = ref(null);
    const sRef = ref(null);
    const lRef = ref(null);
    const aRef = ref(null);

    function updateColor(eventName: string): void {
      const h = getIntValue(hRef, 360);
      const s = getIntValue(sRef, 100);
      const l = getIntValue(lRef, 100);
      const a = getAlphaValue(aRef);

      if (h === null || s === null || l === null || a === null) {
        return;
      }

      const color = Color.fromCssHsla(h, s, l, a);
      emit(eventName, color);
    }

    function onHslInput(e: InputEvent): void {
      const input = e.target as HTMLInputElement;
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^\d+$/.test(value)) {
        updateColor('colorInput');
      }
    }

    function onAlphaInput(e: InputEvent): void {
      const input = e.target as HTMLInputElement;
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^((0)|(1)|(\d\.\d{1,2}))$/.test(value)) {
        updateColor('colorInput');
      }
    }

    function onHslaBlur(): void {
      updateColor('colorBlur');
    }

    function createChannel(options: ChannelParams): VNode {
      const { channelRef, label, value, onInput } = options;

      return h('label', { class: 'nova-color-picker-label' }, [
        h('div', { class: 'nova-color-picker-label-text' }, label),
        h(
          'div',
          { class: 'nova-color-picker-number' },
          h('input', {
            value,
            ref: channelRef,
            onInput,
            onBlur: onHslaBlur,
          })
        ),
      ]);
    }

    return (): VNode | null => {
      const hsla = props.color.toCssHsla();

      const hNode = createChannel({
        channelRef: hRef,
        label: 'H',
        value: hsla.h,
        onInput: onHslInput,
      });

      const sNode = createChannel({
        channelRef: sRef,
        label: 'S',
        value: hsla.s,
        onInput: onHslInput,
      });

      const lNode = createChannel({
        channelRef: lRef,
        label: 'L',
        value: hsla.l,
        onInput: onHslInput,
      });

      const aNode = createChannel({
        channelRef: aRef,
        label: 'A',
        value: hsla.a,
        onInput: onAlphaInput,
      });

      return h('div', { class: 'nova-color-picker-labels' }, [
        hNode,
        sNode,
        lNode,
        aNode,
      ]);
    };
  },
});
