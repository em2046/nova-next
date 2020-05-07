import { defineComponent, h, Ref, ref, VNode } from 'vue';
import Color from '../color';
import Utils from '../../../utils/utils';

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

    function getRgbValue(domRef: Ref<null>): number {
      const dom = (domRef.value as unknown) as HTMLInputElement;
      const value = dom.value.trim();
      let number = parseInt(value, 10);

      if (Number.isNaN(number)) {
        number = 0;
      }
      number = Utils.numberLimit(number, 0, 255);
      dom.value = number.toString();

      return number;
    }

    function getAlphaValue(domRef: Ref<null>): number {
      const dom = (domRef.value as unknown) as HTMLInputElement;
      const value = dom.value.trim();
      let number = parseFloat(parseFloat(value).toFixed(2));
      let needUpdate = false;

      if (Number.isNaN(number)) {
        number = 1;
        needUpdate = true;
      }

      if (number < 0 || number > 1) {
        number = Utils.numberLimit(number, 0, 1);
        needUpdate = true;
      }

      if (/[^\d.]/.test(value)) {
        needUpdate = true;
      }

      if (!/^\d{1,3}\.\d{1,2}$/.test(value)) {
        needUpdate = true;
      }

      if (needUpdate) {
        dom.value = number.toString();
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

    function onRgbaInput(e: InputEvent): void {
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();

      if (value === '') {
        return;
      }

      if (value[value.length - 1] === '.' || value.substr(-2, 2) === '.0') {
        return;
      }

      updateColor('colorInput');
    }

    function onRgbaBlur(): void {
      updateColor('colorBlur');
    }

    return (): VNode | null => {
      const cssRgba = props.color.toCss();

      const rNode = h('label', { class: 'nova-color-picker-label-primary' }, [
        h('div', { class: 'nova-color-picker-label-text' }, 'R'),
        h(
          'div',
          { class: 'nova-color-picker-number-primary' },
          h('input', {
            value: cssRgba.r,
            ref: rRef,
            onInput: onRgbaInput,
            onBlur: onRgbaBlur,
          })
        ),
      ]);

      const gNode = h('label', { class: 'nova-color-picker-label-secondary' }, [
        h('div', { class: 'nova-color-picker-label-text' }, 'G'),
        h(
          'div',
          { class: 'nova-color-picker-number-secondary' },
          h('input', {
            value: cssRgba.g,
            ref: gRef,
            onInput: onRgbaInput,
            onBlur: onRgbaBlur,
          })
        ),
      ]);

      const bNode = h('label', { class: 'nova-color-picker-label-tertiary' }, [
        h('div', { class: 'nova-color-picker-label-text' }, 'B'),
        h(
          'div',
          { class: 'nova-color-picker-number-tertiary' },
          h('input', {
            value: cssRgba.b,
            ref: bRef,
            onInput: onRgbaInput,
            onBlur: onRgbaBlur,
          })
        ),
      ]);

      const aNode = h(
        'label',
        { class: 'nova-color-picker-label-quaternary' },
        [
          h('div', { class: 'nova-color-picker-label-text' }, 'A'),
          h(
            'div',
            { class: 'nova-color-picker-number-quaternary' },
            h('input', {
              value: cssRgba.a,
              ref: aRef,
              onInput: onRgbaInput,
              onBlur: onRgbaBlur,
            })
          ),
        ]
      );

      return h('div', { class: 'nova-color-picker-labels' }, [
        rNode,
        gNode,
        bNode,
        aNode,
      ]);
    };
  },
});
