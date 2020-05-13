import {
  computed,
  defineComponent,
  h,
  reactive,
  VNode,
  watch,
  onMounted,
  Teleport,
  ref,
  Ref,
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
import useDropdown from '../../uses/useDropdown';

const RGBA = Symbol('RGBA');
const HSLA = Symbol('HSLA');

const modeList = [RGBA, HSLA];
const modeSize = modeList.length;
const labelsMap = {
  [RGBA]: RgbaLabels,
  [HSLA]: HslaLabels,
};

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
  format: string;
  preset: string[];
}

export default defineComponent({
  model: {
    event: 'change',
  },
  props: colorPickerProps,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  setup: function (props: Data, context) {
    const emit = context.emit;

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);

    const state = reactive({
      position: {
        /**
         * [0, 200] -> CSS [0, 360)
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
      mode: RGBA,
    });

    /**
     * [0, 360)
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
      return ['nova-color-picker-panel', props.dropdownClass];
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

    function changePropsValue(color: Color): void {
      emit('change', color.toCssHexString());
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
      (value, prevValue) => {
        if (value !== prevValue) {
          const color = Color.fromHex(value);
          setColorAndPosition(color);
        }
      }
    );

    function init(): void {
      const color = Color.fromHex(props.value);
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const currModeLabels = labelsMap[state.mode];
      const formNode = h('div', { class: 'nova-color-picker-form' }, [
        h(currModeLabels, {
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
            [hsvPanelNode, slidesNode, formNode, previewNode]
          )
        );
      }

      const dropdownNode = createDropdown();

      return h('div', { class: classList.value }, [triggerNode, dropdownNode]);
    };
  },
});
