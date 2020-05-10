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

    const rRef = ref(null);
    const gRef = ref(null);
    const bRef = ref(null);
    const aRef = ref(null);

    function updateColor(eventName: string): void {
      const r = getIntValue(rRef, 255);
      const g = getIntValue(gRef, 255);
      const b = getIntValue(bRef, 255);
      const a = getAlphaValue(aRef);

      if (r === null || g === null || b === null || a === null) {
        return;
      }

      const color = Color.fromCss(r, g, b, a);
      emit(eventName, color);
    }

    function onRgbInput(e: InputEvent): void {
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

    function onRgbaBlur(): void {
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
            onBlur: onRgbaBlur,
          })
        ),
      ]);
    }

    return (): VNode | null => {
      const { r, g, b, a } = props.color.toCss();

      const rNode = createChannel({
        channelRef: rRef,
        label: 'R',
        value: r,
        onInput: onRgbInput,
      });

      const gNode = createChannel({
        channelRef: gRef,
        label: 'G',
        value: g,
        onInput: onRgbInput,
      });

      const bNode = createChannel({
        channelRef: bRef,
        label: 'B',
        value: b,
        onInput: onRgbInput,
      });

      const aNode = createChannel({
        channelRef: aRef,
        label: 'A',
        value: a,
        onInput: onAlphaInput,
      });

      return h('div', { class: 'nova-color-picker-labels' }, [
        rNode,
        gNode,
        bNode,
        aNode,
      ]);
    };
  },
});
