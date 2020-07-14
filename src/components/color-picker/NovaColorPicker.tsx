import {
  computed,
  CSSProperties,
  onMounted,
  reactive,
  Ref,
  ref,
  SetupContext,
  Teleport,
  Transition,
  VNode,
  VNodeProps,
  vShow,
  watch,
  withDirectives,
} from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { MovePosition } from '../../uses/use-move';
import useDropdown, { durationLong } from '../../uses/use-dropdown';
import Utils from '../../utils/utils';
import Color, { ColorFormat } from './color';
import { Trigger } from './parts/Trigger';
import { HsvPanel } from './parts/HsvPanel';
import { HueSlide } from './parts/slides/HueSlide';
import { AlphaSlide } from './parts/slides/AlphaSlide';
import { RgbaLabels } from './parts/labels/RgbaLabels';
import { HslaLabels } from './parts/labels/HslaLabels';
import { HexLabel } from './parts/labels/HexLabel';
import { Preview } from './parts/Preview';
import { PresetValues } from './parts/PresetValues';
import useEnvironment, {
  environmentProps,
  NovaEnvironmentProps,
} from '../../uses/use-environment';
import { MDIClose } from '@em2046/material-design-icons-vue-next';
import DomUtils from '../../utils/dom-utils';

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

export interface NovaColorPickerProps extends NovaEnvironmentProps {
  value?: string;
  disabled?: boolean;
  dropdownClass?: unknown;
  dropdownStyle?: string | CSSProperties;
  dropdownProps?: {
    [key: string]: unknown;
  };
  teleportToBody?: boolean;
  alpha?: boolean;
  format?: ColorFormat;
  preset?: string[];
  onUpdate?: (color: string) => void;
  onOpenChange?: (opened: boolean) => void;
}

const defaultValue = '#ff0000';

const colorPickerProps = {
  ...environmentProps,
  value: {
    type: String,
    default: defaultValue,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dropdownClass: {
    type: [String, Array, Object],
    default: null,
  },
  dropdownStyle: {
    type: Object,
    default: null,
  },
  dropdownProps: {
    type: Object,
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
    type: Array,
    default: null,
  },
};

export interface NovaColorPickerPresetScoped {
  preset: string[];
  color: Color;
  setColorAndPosition: (color: Color) => void;
}

export interface NovaColorPickerTriggerScoped {
  color: Color;
  disabled: boolean;
}

const NovaColorPickerImpl = {
  name: 'NovaColorPicker',
  props: colorPickerProps,
  setup(props: NovaColorPickerProps, context: SetupContext) {
    const emit = context.emit;

    const environment = useEnvironment(props as NovaEnvironmentProps);

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);
    const autoFocusRef: Ref<HTMLElement | null> = ref(null);
    const trapHeaderRef: Ref<HTMLElement | null> = ref(null);
    const trapTrailerRef: Ref<HTMLElement | null> = ref(null);

    let trapped = false;

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

    function trapHeaderFocus() {
      const focusable = DomUtils.getFocusable(dropdownRef.value);
      nextFocus(focusable[focusable.length - 1]);
    }

    function trapTrailerFocus() {
      const focusable = DomUtils.getFocusable(dropdownRef.value);
      nextFocus(focusable[0]);
    }

    function nextFocus(target: HTMLElement | null) {
      if (trapped) {
        return;
      }

      trapped = true;
      target?.focus();

      requestAnimationFrame(() => {
        trapped = false;
      });
    }

    const {
      dropdown,
      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,
      onLeaveCancelled,
      closeDropdown,
    } = useDropdown({
      triggerRef,
      dropdownRef,
      autoFocusRef,
      reset,
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

    function reset() {
      const color = Color.parse(props.value);
      setColorAndPosition(color);
    }

    function init(): void {
      reset();
    }

    onMounted(() => {
      init();
    });

    return (): JSX.Element => {
      function createTrigger() {
        function onAssignRef(assignedRef: Ref<HTMLElement | null>): void {
          triggerRef.value = assignedRef.value;
        }

        const triggerProps = {
          disabled: !!props.disabled,
          color: state.color,
        };

        const trigger = context.slots.trigger;

        let triggerNode = null;
        if (trigger) {
          triggerNode = () =>
            trigger({
              ...triggerProps,
            });
        }

        return (
          <Trigger onAssignRef={onAssignRef} {...triggerProps}>
            {triggerNode}
          </Trigger>
        );
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

        function onAssignRef(assignedRef: Ref<HTMLElement | null>) {
          if (assignedRef.value) {
            autoFocusRef.value = assignedRef.value;
          }
        }

        return (
          <CurrLabels
            color={state.color}
            alpha={!!props.alpha}
            onColorInput={setColorAndPosition}
            onColorBlur={setColorAndPosition}
            environment={environment}
            onAssignRef={onAssignRef}
          />
        );
      }

      function createForm() {
        function onKeydown(e: KeyboardEvent) {
          switch (e.key) {
            case 'Enter':
              switchMode();
              e.stopPropagation();
              break;
          }
        }

        const labelsNode = createLabels();
        return (
          <div class="nova-color-picker-form">
            <div
              class="nova-color-picker-labels-switch"
              onClick={switchMode}
              onKeydown={onKeydown}
              tabindex={0}
            />
            {labelsNode}
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
          <Preview
            color={state.color}
            value={props.value || defaultValue}
            onReset={init}
          />
        );
      }

      function createPreset() {
        const slotPreset = context.slots.preset;
        const presetProps = {
          preset: props.preset,
          color: state.color,
        };

        let slotPresetNode = null;
        if (slotPreset) {
          slotPresetNode = () =>
            slotPreset({
              ...presetProps,
              setColorAndPosition,
            });
        }

        if (!props.preset?.length && !slotPresetNode) {
          return null;
        }

        return (
          <PresetValues
            preset={props.preset || []}
            color={state.color}
            onSelect={setColorAndPosition}
          >
            {slotPresetNode}
          </PresetValues>
        );
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
            role="dialog"
            data-nova-theme={environment.themeRef.value}
            ref={dropdownRef}
            class={dropdownClassList.value}
            style={props.dropdownStyle}
            {...props.dropdownProps}
          >
            <div
              class="nova-trap"
              data-nova-trap="header"
              tabindex={0}
              ref={trapHeaderRef}
              onFocus={trapHeaderFocus}
            />
            {hsvPanelNode}
            {slidesNode}
            {formNode}
            {previewNode}
            {presetNode}
            <div
              class="nova-color-picker-close"
              tabindex={0}
              onClick={closeDropdown}
            >
              <MDIClose />
            </div>
            <div
              class="nova-trap"
              data-nova-trap="trailer"
              tabindex={0}
              ref={trapTrailerRef}
              onFocus={trapTrailerFocus}
            />
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
      const borderNode = <div class="nova-color-picker-border" />;

      return (
        <div
          class={classList.value}
          data-nova-theme={environment.themeRef.value}
        >
          {triggerNode}
          {borderNode}
          {dropdownNode}
        </div>
      );
    };
  },
};

export const NovaColorPicker = (NovaColorPickerImpl as unknown) as {
  new (): {
    $props: VNodeProps & NovaColorPickerProps;
  };
};
