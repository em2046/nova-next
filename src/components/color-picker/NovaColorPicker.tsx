import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  Ref,
  ref,
  Teleport,
  Transition,
  VNode,
  vShow,
  watch,
  withDirectives,
} from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { MovePosition } from '../../uses/use-move';
import useDropdown, { durationLong } from '../../uses/use-dropdown';
import Utils from '../../utils/utils';
import Color from './color';
import Trigger from './parts/Trigger';
import HsvPanel from './parts/HsvPanel';
import HueSlide from './parts/slides/HueSlide';
import AlphaSlide from './parts/slides/AlphaSlide';
import RgbaLabels from './parts/labels/RgbaLabels';
import HslaLabels from './parts/labels/HslaLabels';
import HexLabel from './parts/labels/HexLabel';
import Preview from './parts/Preview';
import PresetValues from './parts/PresetValues';
import useEnvironment, {
  EnvironmentProps,
  environmentProps,
} from '../../uses/use-environment';
import { PropClass, PropStyle } from '../../utils/type';

//region Mode
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
  ...environmentProps,
  value: {
    type: String,
    default: '#ff0000',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dropdownClass: {
    type: [String, Array, Object] as PropClass,
    default: null,
  },
  dropdownStyle: {
    type: Object as PropStyle,
    default: null,
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
    type: Array as PropType<string[]>,
    default: null,
  },
};

export interface PresetScoped {
  preset: string[];
  color: Color;
  setColorAndPosition: (color: Color) => void;
}

export default defineComponent({
  name: 'NovaColorPicker',
  props: colorPickerProps,
  setup(props, context) {
    const emit = context.emit;

    const environment = useEnvironment(props as EnvironmentProps);

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
          ['nova-color-picker-opened']: dropdown.opened,
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

      const hue = Utils.numberLimit((hsva.hue / 360) * 200, 0, 200);
      const saturation = Utils.numberLimit(hsva.saturation * 200, 0, 200);
      const value = Utils.numberLimit(200 - 200 * hsva.value, 0, 200);
      const alpha = Utils.numberLimit(200 - 200 * hsva.alpha, 0, 200);

      state.position.hue = hue;
      state.position.saturation = saturation;
      state.position.value = value;
      state.position.alpha = alpha;
    }

    function setColor(color: Color): void {
      if (props.alpha) {
        state.color = color;
      } else {
        state.color = new Color(color.red, color.green, color.blue);
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
      // JSX onUpdate
      emit('update', color.toString(props.format));

      // Template v-model:value
      emit('update:value', color.toString(props.format));
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

    const {
      dropdown,
      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,
      onLeaveCancelled,
    } = useDropdown({
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

    watch(
      () => props.alpha,
      (value) => {
        if (!value) {
          const { red, green, blue } = state.color;
          const color = new Color(red, green, blue);
          setColorAndPosition(color);
        }
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
      function createTrigger() {
        function onAssignRef(assignedRef: Ref<HTMLElement | null>): void {
          triggerRef.value = assignedRef.value;
        }

        return <Trigger color={state.color} onAssignRef={onAssignRef} />;
      }

      function createHsvPanel() {
        function onHsvMove(position: MovePosition): void {
          state.position.saturation = Utils.numberLimit(position.x, 0, 200);
          state.position.value = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        }

        return (
          <HsvPanel
            hueReg={hueDegrees.value}
            saturation={state.position.saturation}
            value={state.position.value}
            onMove={onHsvMove}
          />
        );
      }

      function createHue() {
        function onHueMove(position: MovePosition): void {
          state.position.hue = Utils.numberLimit(position.y, 0, 200);
          setColorFromPosition();
        }

        return <HueSlide hue={state.position.hue} onMove={onHueMove} />;
      }

      function createAlpha() {
        if (!props.alpha) {
          return null;
        }

        function onAlphaMove(position: MovePosition): void {
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

      function createSlides() {
        const alphaSlideNode = createAlpha();
        const hueSlideNode = createHue();

        return (
          <div class="nova-color-picker-slides">
            {hueSlideNode}
            {alphaSlideNode}
          </div>
        );
      }

      function createLabels() {
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
            environment={environment}
          />
        );
      }

      function createForm() {
        const labelsNode = createLabels();
        return (
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
      }

      function createPreview() {
        return (
          <Preview color={state.color} value={props.value} onReset={init} />
        );
      }

      function createPreset() {
        const preset = context.slots.preset;
        const presetProps = {
          preset: props.preset,
          color: state.color,
        };

        if (preset) {
          return preset({
            ...presetProps,
            setColorAndPosition,
          });
        }

        if (!props.preset?.length) {
          return null;
        }

        return <PresetValues {...presetProps} onSelect={setColorAndPosition} />;
      }

      function createDropdown() {
        if (!dropdown.loaded || props.disabled) {
          return null;
        }

        let beforeAppearFlag = false;
        let afterAppearFlag = false;

        const hsvPanelNode = createHsvPanel();
        const slidesNode = createSlides();
        const formNode = createForm();
        const previewNode = createPreview();
        const presetNode = createPreset();

        const dropdownCoreNode = (
          <div
            data-nova-theme={environment.themeRef.value}
            ref={dropdownRef}
            class={dropdownClassList.value}
            style={props.dropdownStyle}
          >
            {hsvPanelNode}
            {slidesNode}
            {formNode}
            {previewNode}
            {presetNode}
            <div class="nova-color-picker-panel-border" />
          </div>
        );

        function onBeforeAppear(el: Element) {
          if (beforeAppearFlag) {
            return;
          }

          beforeAppearFlag = true;
          onBeforeEnter(el);
        }

        function onAfterAppear(el: Element) {
          if (afterAppearFlag) {
            return;
          }

          afterAppearFlag = true;
          onAfterEnter(el);
        }

        return (
          <Teleport to="body" disabled={!props.teleportToBody}>
            <Transition
              name="nova-dropdown"
              duration={durationLong}
              appear
              onBeforeAppear={onBeforeAppear}
              onAfterAppear={onAfterAppear}
              onBeforeEnter={onBeforeEnter}
              onAfterEnter={onAfterEnter}
              onBeforeLeave={onBeforeLeave}
              onAfterLeave={onAfterLeave}
              onLeaveCancelled={onLeaveCancelled}
            >
              {() =>
                withDirectives(dropdownCoreNode as VNode, [
                  [vShow, dropdown.opened],
                ])
              }
            </Transition>
          </Teleport>
        );
      }

      const triggerNode = createTrigger();
      const dropdownNode = createDropdown();

      return (
        <div
          class={classList.value}
          data-nova-theme={environment.themeRef.value}
          tabindex={props.disabled ? -1 : 0}
        >
          <div class="nova-color-picker-border" />
          {triggerNode}
          {dropdownNode}
        </div>
      );
    };
  },
});
