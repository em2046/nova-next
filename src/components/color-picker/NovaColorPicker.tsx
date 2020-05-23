import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  Ref,
  Teleport,
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
import { vueJsxCompat } from '../../vue-jsx-compat';

//region mode
const modeRgba = Symbol('rgba');
const modeHsla = Symbol('hsla');

const labelsMap = new Map([
  [modeRgba, RgbaLabels],
  [modeHsla, HslaLabels],
]);

const modeList = [...labelsMap.keys()];
const modeSize = modeList.length;

//endregion

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

export default defineComponent({
  name: 'NovaColorPicker',
  model: {
    event: 'update',
  },
  props: colorPickerProps,
  setup(props, context) {
    const emit = context.emit;

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);

    const mode = props.format === 'hsl' ? modeHsla : modeRgba;
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

    return (): JSX.Element => {
      function onAssignRef(assignedRef: Ref<HTMLElement | null>): void {
        triggerRef.value = assignedRef.value;
      }

      const triggerNode = (
        <Trigger color={state.color} onAssignRef={onAssignRef} />
      );

      function getOnMove(position: MousePosition): void {
        state.position.saturation = Utils.numberLimit(position.x, 0, 200);
        state.position.value = Utils.numberLimit(position.y, 0, 200);
        setColorFromPosition();
      }

      const hsvPanelNode = (
        <HsvPanel
          hueReg={hueDegrees.value}
          saturation={state.position.saturation}
          value={state.position.value}
          onMove={getOnMove}
        />
      );

      function createPreset(): JSX.Element | null {
        if (!props.preset.length) {
          return null;
        }

        return (
          <PresetValues
            preset={props.preset}
            color={state.color}
            onSelect={setColorAndPosition}
          />
        );
      }

      const presetNode = createPreset();

      function onAlphaMove(position: MousePosition): void {
        state.position.hue = Utils.numberLimit(position.y, 0, 200);
        setColorFromPosition();
      }

      const hueSlideNode = (
        <HueSlide hue={state.position.hue} onMove={onAlphaMove} />
      );

      function createAlpha(): JSX.Element | null {
        if (!props.alpha) {
          return null;
        }

        function onAlphaMove(position: MousePosition): void {
          state.position.alpha = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        }

        return (
          <AlphaSlide
            alpha={state.position.alpha}
            color={state.color}
            onMove={onAlphaMove}
          />
        );
      }

      const alphaSlideNode = createAlpha();

      const slidesNode = (
        <div class="nova-color-picker-slides">
          {hueSlideNode}
          {alphaSlideNode}
        </div>
      );

      function createLabels(): JSX.Element | null {
        const CurrLabels = labelsMap.get(state.mode);
        if (!CurrLabels) {
          return null;
        }

        return (
          <CurrLabels
            color={state.color}
            alpha={props.alpha}
            onColorInput={setColorAndPosition}
            onColorBlur={setColorAndPosition}
          />
        );
      }

      const labelsNode = createLabels();
      const formNode = (
        <div class="nova-color-picker-form">
          {labelsNode}
          <div class="nova-color-picker-labels-switch" onClick={switchMode} />
          <HexLabel
            color={state.color}
            onColorInput={setColorAndPosition}
            onColorBlur={setColorAndPosition}
          />
        </div>
      );

      const previewNode = (
        <Preview color={state.color} value={props.value} onReset={init} />
      );

      function createDropdown(): JSX.Element | null {
        if (!dropdown.opened || props.disabled) {
          return null;
        }

        const style = Object.assign(
          {},
          props.dropdownStyle,
          dropdownStyle.value
        );

        return (
          <Teleport to="body" disabled={!props.teleportToBody}>
            <div
              ref={dropdownRef}
              class={dropdownClassList.value}
              style={style}
            >
              {hsvPanelNode}
              {slidesNode}
              {formNode}
              {previewNode}
              {presetNode}
            </div>
          </Teleport>
        );
      }

      const dropdownNode = createDropdown();

      return (
        <div class={classList.value}>
          {triggerNode}
          {dropdownNode}
        </div>
      );
    };
  },
});
