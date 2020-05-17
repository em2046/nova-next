import {
  computed,
  defineComponent,
  h,
  onMounted,
  reactive,
  ref,
  Ref,
  Teleport,
  VNode,
  watch,
} from 'vue';
import Color from './color';
import Utils from '../../utils/utils';
import { MousePosition } from '../../uses/useMousemove';
import HsvPanel from './parts/HsvPanel';
import HueSlide from './parts/slides/HueSlide';
import AlphaSlide from './parts/slides/AlphaSlide';
import Preview from './parts/Preview';
import RgbaLabels from './parts/labels/RgbaLabels';
import HslaLabels from './parts/labels/HslaLabels';
import HexLabel from './parts/labels/HexLabel';
import Trigger from './parts/Trigger';
import PresetValues from './parts/PresetValues';
import useDropdown from '../../uses/useDropdown';

const rgba = Symbol('rgba');
const hsla = Symbol('hsla');

const modeList = [rgba, hsla];
const modeSize = modeList.length;
const labelsMap = {
  [rgba]: RgbaLabels,
  [hsla]: HslaLabels,
};

type Format = 'hex' | 'rgb' | 'hsl';

const colorPickerProps = {
  value: {
    type: String,
    default: '#ff0000',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dropdownClass: {
    type: [String, Array, Object],
    default: '',
  },
  dropdownStyle: {
    type: Object,
    default: {},
  },
  teleportToBody: {
    type: Boolean,
    default: true,
  },
  alpha: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: 'hex',
  },
  preset: {
    type: Array,
    default: [],
  },
};

interface Data {
  value: string;
  disabled: boolean;
  dropdownClass: string | object | (string | object)[];
  dropdownStyle: object;
  teleportToBody: boolean;
  alpha: boolean;
  format: Format;
  preset: string[];
}

export default defineComponent({
  name: 'NovaColorPicker',
  model: {
    event: 'update',
  },
  props: colorPickerProps,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  setup(props: Data, context) {
    const emit = context.emit;

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);

    const mode = props.format === 'hsl' ? hsla : rgba;
    const state = reactive({
      position: {
        /**
         * [0, 200] -> CSS [0, 360]
         */
        hue: 0,
        /**
         * [0, 200] -> CSS [0, 100]
         */
        saturation: 200,
        /**
         * [0, 200] -> CSS [100, 0]
         */
        value: 0,
        /**
         * [0, 200] -> CSS [1, 0]
         */
        alpha: 0,
      },
      color: Color.fromCssLikeHsva(0, 100, 100, 1),
      mode,
    });

    /**
     * [0, 360]
     */
    const hueDegrees = computed(() => {
      return Math.round((state.position.hue / 200) * 360) % 360;
    });

    const classList = computed(() => {
      return [
        'nova-color-picker',
        {
          ['nova-color-picker-disabled']: props.disabled,
        },
      ];
    });

    const dropdownClassList = computed(() => {
      return [
        'nova-color-picker-panel',
        props.dropdownClass,
        {
          ['nova-color-picker-panel-has-alpha']: props.alpha,
        },
      ];
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
      const hsva = color.toHsva();

      const hue = Utils.numberLimit((hsva.h / 360) * 200, 0, 200);
      const saturation = Utils.numberLimit(hsva.s * 200, 0, 200);
      const value = Utils.numberLimit(200 - 200 * hsva.v, 0, 200);
      const alpha = Utils.numberLimit(200 - 200 * hsva.a, 0, 200);

      state.position.hue = hue;
      state.position.saturation = saturation;
      state.position.value = value;

      if (props.alpha) {
        state.position.alpha = alpha;
      }
    }

    function setColor(color: Color): void {
      if (props.alpha) {
        state.color = color;
      } else {
        state.color = new Color(color.r, color.g, color.b);
      }
    }

    function setColorAndPosition(color: Color): void {
      setPositionFromColor(color);
      setColor(color);
    }

    function setColorFromPosition(): void {
      setColor(getColorFromPosition());
    }

    function changePropsValue(color: Color): void {
      emit('update', color.toString(props.format));
    }

    function switchMode(): void {
      let activeModeIndex = modeList.findIndex((mode) => {
        return state.mode === mode;
      });

      activeModeIndex++;
      if (activeModeIndex >= modeSize) {
        activeModeIndex = 0;
      }

      state.mode = modeList[activeModeIndex];
    }

    const { dropdown, dropdownStyle } = useDropdown({
      triggerRef,
      dropdownRef,
      props,
      onOpen: () => {
        emit('openChange', true);
      },
      onClose: () => {
        emit('openChange', false);
        changePropsValue(state.color);
      },
    });

    watch(
      () => props.value,
      (value) => {
        const color = Color.parse(value);
        setColorAndPosition(color);
      }
    );

    function init(): void {
      const color = Color.parse(props.value);
      setColorAndPosition(color);
    }

    onMounted(() => {
      init();
    });

    return (): VNode => {
      const triggerNode = h(Trigger, {
        color: state.color,
        onAssignRef: (assignedRef: Ref<HTMLElement | null>) => {
          triggerRef.value = assignedRef.value;
        },
      });

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

      function createPreset(): VNode | null {
        if (!props.preset.length) {
          return null;
        }

        return h(PresetValues, {
          preset: props.preset,
          color: state.color,
          onSelect: (color: Color) => {
            setColorAndPosition(color);
          },
        });
      }

      const presetNode = createPreset();

      const hueSlideNode = h(HueSlide, {
        hue: state.position.hue,
        onMove: (position: MousePosition) => {
          state.position.hue = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        },
      });

      function createAlpha(): VNode | null {
        if (!props.alpha) {
          return null;
        }

        return h(AlphaSlide, {
          alpha: state.position.alpha,
          color: state.color,
          onMove: (position: MousePosition) => {
            state.position.alpha = Utils.numberLimit(position.y, 0, 200);
            setColorFromPosition();
          },
        });
      }

      const alphaSlideNode = createAlpha();

      const slidesNode = h('div', { class: 'nova-color-picker-slides' }, [
        hueSlideNode,
        alphaSlideNode,
      ]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const currModeLabels = labelsMap[state.mode];
      const formNode = h('div', { class: 'nova-color-picker-form' }, [
        h(currModeLabels, {
          color: state.color,
          alpha: props.alpha,
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
        h('div', {
          class: 'nova-color-picker-labels-switch',
          onClick: switchMode,
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
        if (!dropdown.opened || props.disabled) {
          return null;
        }

        return h(
          Teleport,
          { to: 'body', disabled: !props.teleportToBody },
          h(
            'div',
            {
              ref: dropdownRef,
              class: dropdownClassList.value,
              style: Object.assign(
                {},
                props.dropdownStyle,
                dropdownStyle.value
              ),
            },
            [hsvPanelNode, slidesNode, formNode, previewNode, presetNode]
          )
        );
      }

      const dropdownNode = createDropdown();

      return h('div', { class: classList.value }, [triggerNode, dropdownNode]);
    };
  },
});
