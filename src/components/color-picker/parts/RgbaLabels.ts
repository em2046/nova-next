import { defineComponent, h, Ref, ref, VNode } from 'vue';
import Rgba from '../rgba';

export default defineComponent({
  props: {
    color: {
      type: Object,
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
      return parseInt(value, 10);
    }

    function getAlphaValue(domRef: Ref<null>): number {
      const dom = (domRef.value as unknown) as HTMLInputElement;
      const value = dom.value.trim();
      return parseFloat(value);
    }

    function onRgbaInput(): void {
      const r = getRgbValue(rRef);
      const g = getRgbValue(gRef);
      const b = getRgbValue(bRef);
      const a = getAlphaValue(aRef);

      const rgba = Rgba.fromCss(r, g, b, a);
      emit('setColor', rgba);
    }

    return (): VNode | null => {
      if (!props.color) {
        return null;
      }

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
