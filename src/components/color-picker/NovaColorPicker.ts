import {
  computed,
  defineComponent,
  h,
  reactive,
  VNode,
  watch,
  onMounted,
  onUnmounted,
  Teleport,
  ref,
} from 'vue';
import Color from './color';
import Utils from '../../utils/utils';
import { MousePosition } from '../../uses/useMousemove';
import HsvPanel from './parts/HsvPanel';
import HueSlide from './parts/slides/HueSlide';
import AlphaSlide from './parts/slides/AlphaSlide';
import Preview from './parts/Preview';
import RgbaLabels from './parts/labels/RgbaLabels';
import HexLabel from './parts/labels/HexLabel';
import DomHelper from '../../utils/dom-helper';

export default defineComponent({
  model: {
    event: 'update',
  },
  props: {
    value: {
      type: String,
      default: '#ff0000',
    },
  },
  setup: function (props, context) {
    const emit = context.emit;

    const triggerRef = ref(null);
    const dropdownRef = ref(null);

    const state = reactive({
      position: {
        // pos [0, 200] -> CSS h [0, 360]
        hue: 0,
        // pos [0, 200] -> CSS s [0, 100]
        saturation: 200,
        // pos [0, 200] -> CSS v [100, 0]
        value: 0,
        // pos [0, 200] -> CSS a [1, 0]
        alpha: 0,
      },
      color: Color.fromCssLikeHsva(0, 100, 100, 1),
      dropdown: {
        opened: false,
        offset: {
          left: 0,
          top: 0,
        },
      },
    });

    const dropdownStyle = computed(() => {
      const offset = state.dropdown.offset;
      return {
        left: `${offset.left}px`,
        top: `${offset.top}px`,
      };
    });

    const triggerInnerStyle = computed(() => {
      const { r, g, b, a } = state.color.toCss();
      return {
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
      };
    });

    const hueDegrees = computed(() => {
      return Math.round((state.position.hue / 200) * 360) % 360;
    });

    function getColorFromPosition(): Color {
      return Color.fromCssLikeHsva(
        hueDegrees.value,
        state.position.saturation / 2,
        (200 - state.position.value) / 2,
        (200 - state.position.alpha) / 200
      );
    }

    function setPositionFromColor(color: Color): void {
      const { h, s, v, a } = color.toHsva();

      const hue = Utils.numberLimit((h / 360) * 200, 0, 200);
      const saturation = Utils.numberLimit(s * 200, 0, 200);
      const value = Utils.numberLimit(200 - 200 * v, 0, 200);
      const alpha = Utils.numberLimit(200 - 200 * a, 0, 200);

      state.position.hue = hue;
      state.position.saturation = saturation;
      state.position.value = value;
      state.position.alpha = alpha;
    }

    function setColor(color: Color): void {
      state.color = color;
    }

    function setColorAndPosition(color: Color): void {
      const panelColor = getColorFromPosition();

      if (panelColor.toHex() !== color.toHex()) {
        setPositionFromColor(color);
        setColor(color);
      }
    }

    function setColorFromPosition(): void {
      setColor(getColorFromPosition());
    }

    function updatePropsValue(color: Color): void {
      emit('update', `#${color.toHex()}`);
    }

    function onVirtualMaskMousedown(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      const dropdown = (dropdownRef.value as unknown) as HTMLElement;
      const stopDropdown = DomHelper.isInElement(target, dropdown);
      const trigger = (triggerRef.value as unknown) as HTMLElement;
      const stopTrigger = DomHelper.isInElement(target, trigger);

      if (stopDropdown || stopTrigger) {
        return;
      }

      updatePropsValue(state.color);

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      closeDropdown();
    }

    function closeDropdown(): void {
      document.removeEventListener('mousedown', onVirtualMaskMousedown);
      state.dropdown.opened = false;
    }

    function onTriggerClick(): void {
      document.addEventListener('mousedown', onVirtualMaskMousedown);
      state.dropdown.opened = true;
      const trigger = (triggerRef.value as unknown) as HTMLElement;
      const rect = DomHelper.getElementPosition(trigger);
      state.dropdown.offset.left = rect.left;
      state.dropdown.offset.top = rect.top + rect.height;
    }

    watch(
      () => props.value,
      (value, prevValue) => {
        if (value !== prevValue) {
          const color = Color.fromHex(value);
          setColorAndPosition(color);
        }
      }
    );

    onUnmounted(() => {
      closeDropdown();
    });

    function init(): void {
      const color = Color.fromHex(props.value);
      setColorAndPosition(color);
    }

    onMounted(() => {
      init();
    });

    return (): VNode => {
      const triggerNode = h(
        'div',
        {
          class: 'nova-color-picker-trigger',
          ref: triggerRef,
          onClick: onTriggerClick,
        },
        h('div', {
          class: 'nova-color-picker-trigger-inner',
          style: triggerInnerStyle.value,
        })
      );

      const hsvPanelNode = h(HsvPanel, {
        hueReg: hueDegrees.value,
        saturation: state.position.saturation,
        value: state.position.value,
        onMove: (position: MousePosition) => {
          state.position.saturation = Utils.numberLimit(position.x, 0, 200);
          state.position.value = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        },
      });

      const hueSlideNode = h(HueSlide, {
        hue: state.position.hue,
        onMove: (position: MousePosition) => {
          state.position.hue = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        },
      });

      const alphaSlideNode = h(AlphaSlide, {
        alpha: state.position.alpha,
        color: state.color,
        onMove: (position: MousePosition) => {
          state.position.alpha = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        },
      });

      const slidesNode = h('div', { class: 'nova-color-picker-slides' }, [
        hueSlideNode,
        alphaSlideNode,
      ]);

      const formNode = h('div', { class: 'nova-color-picker-form' }, [
        h(RgbaLabels, {
          color: state.color,
          onColorInput: (color: Color) => {
            setColorAndPosition(color);
          },
          onColorBlur: (color: Color) => {
            setColorAndPosition(color);
          },
        }),
        h(HexLabel, {
          color: state.color,
          onColorInput: (color: Color) => {
            setColorAndPosition(color);
          },
          onColorBlur: (color: Color) => {
            setColorAndPosition(color);
          },
        }),
      ]);

      const previewNode = h(Preview, {
        color: state.color,
        value: props.value,
        onReset() {
          init();
        },
      });

      function createDropdown(): VNode | null {
        if (!state.dropdown.opened) {
          return null;
        }
        return h(
          Teleport,
          { to: 'body' },
          h(
            'div',
            {
              ref: dropdownRef,
              class: 'nova-color-picker-panel',
              style: dropdownStyle.value,
            },
            [hsvPanelNode, slidesNode, formNode, previewNode]
          )
        );
      }

      const dropdownNode = createDropdown();

      return h('div', { class: 'nova-color-picker' }, [
        triggerNode,
        dropdownNode,
      ]);
    };
  },
});
