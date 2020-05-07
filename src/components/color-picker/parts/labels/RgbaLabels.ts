import { defineComponent, h, Ref, ref, VNode } from 'vue';
import Color from '../../color';
import Utils from '../../../../utils/utils';
import DomHelper from '../../../../utils/dom-helper';

interface ChannelParams {
  channelRef: Ref<null>;
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

    function rgbNormalize(value: string): number {
      value = value.replace(/[^\d]/g, '');
      let number = parseInt(value, 10);

      if (Number.isNaN(number)) {
        number = 0;
      }
      number = Utils.numberLimit(number, 0, 255);
      return number;
    }

    function getRgbValue(domRef: Ref<null>): number {
      const input = (domRef.value as unknown) as HTMLInputElement;
      const value = DomHelper.getInputValue(input);
      const number = rgbNormalize(value);
      DomHelper.setInputValue(input, number);

      return number;
    }

    function alphaNormalize(value: string): number {
      value = value.replace(/[^\d.]/g, '');
      let number = parseFloat(parseFloat(value).toFixed(2));

      if (Number.isNaN(number)) {
        number = 1;
      }

      number = Utils.numberLimit(number, 0, 1);
      return number;
    }

    function getAlphaValue(domRef: Ref<null>): number {
      const input = (domRef.value as unknown) as HTMLInputElement;
      const value = DomHelper.getInputValue(input);
      const number = alphaNormalize(value);

      if (number.toString() !== value) {
        DomHelper.setInputValue(input, number);
      }

      return number;
    }

    function updateColor(eventName: string): void {
      const r = getRgbValue(rRef);
      const g = getRgbValue(gRef);
      const b = getRgbValue(bRef);
      const a = getAlphaValue(aRef);
      const rgba = Color.fromCss(r, g, b, a);
      emit(eventName, rgba);
    }

    function onRgbInput(e: InputEvent): void {
      const input = e.target as HTMLInputElement;
      const value = DomHelper.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^\d+$/.test(value)) {
        updateColor('colorInput');
      }
    }

    function onAlphaInput(e: InputEvent): void {
      const input = e.target as HTMLInputElement;
      const value = DomHelper.getInputValue(input);

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

    function createChannelNode(options: ChannelParams): VNode {
      const { channelRef, label, value, onInput } = options;

      return h('label', { class: 'nova-color-picker-label' }, [
        h('div', { class: 'nova-color-picker-label-text' }, label),
        h(
          'div',
          { class: 'nova-color-picker-number' },
          h('input', {
            value,
            ref: channelRef,
            onInput: onInput,
            onBlur: onRgbaBlur,
          })
        ),
      ]);
    }

    return (): VNode | null => {
      const { r, g, b, a } = props.color.toCss();

      const rNode = createChannelNode({
        channelRef: rRef,
        label: 'R',
        value: r,
        onInput: onRgbInput,
      });

      const gNode = createChannelNode({
        channelRef: gRef,
        label: 'G',
        value: g,
        onInput: onRgbInput,
      });

      const bNode = createChannelNode({
        channelRef: bRef,
        label: 'B',
        value: b,
        onInput: onRgbInput,
      });

      const aNode = createChannelNode({
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
