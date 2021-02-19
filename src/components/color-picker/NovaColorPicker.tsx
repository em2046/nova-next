import {
  computed,
  HTMLAttributes,
  onMounted,
  reactive,
  Ref,
  ref,
  SetupContext,
  VNodeProps,
  watch,
} from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { MovePosition } from '../../uses/use-move';
import { Color, ColorFormat } from './color';
import { Trigger } from './parts/Trigger';
import { HsvPanel } from './parts/HsvPanel';
import { HueSlide } from './parts/slides/HueSlide';
import { AlphaSlide } from './parts/slides/AlphaSlide';
import { RgbaLabels } from './parts/labels/RgbaLabels';
import { HslaLabels } from './parts/labels/HslaLabels';
import { HexLabel } from './parts/labels/HexLabel';
import { Preview } from './parts/Preview';
import { PresetValues } from './parts/PresetValues';
import { useEnvironment } from '../../uses/use-environment';
import { MDIClose } from '@em2046/material-design-icons-vue-next';
import { NovaDropdown } from '../dropdown';
import {
  DropdownInstance,
  DropdownPanelScoped,
  dropdownProps,
  DropdownProps,
  DropdownTriggerScoped,
} from '../dropdown/NovaDropdown';
import { VueComponentProps } from '../../types/vue-component';
import {
  environmentProps,
  EnvironmentProps,
} from '../environment/NovaEnvironment';
import { numberLimit } from '../../utils/utils';

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

export interface ColorPickerProps extends EnvironmentProps, DropdownProps {
  value?: string;
  alpha?: boolean;
  format?: ColorFormat;
  preset?: string[];
  onUpdate?: (color: string) => void;
  onOpenChange?: (opened: boolean) => void;
}

const defaultValue = '#ff0000';

const colorPickerProps = {
  ...environmentProps,
  ...dropdownProps,
  value: {
    type: String,
    default: defaultValue,
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

export interface ColorPickerPresetScoped {
  preset: string[];
  color: Color;
  setColorAndPosition: (color: Color) => void;
}

export interface ColorPickerTriggerScoped extends DropdownTriggerScoped {
  color: Color;
}

const NovaColorPickerImpl = {
  name: 'NovaColorPicker',
  props: colorPickerProps,
  emits: ['update', 'update:value'],
  setup(props: ColorPickerProps, context: SetupContext) {
    const emit = context.emit;

    const environment = useEnvironment(props as EnvironmentProps);
    const dropdownInstanceRef = ref<DropdownInstance | null>(null);
    const colorPickerTriggerAutoFocusRef = ref<HTMLElement | null>(null);
    const colorPickerPanelAutoFocusRef = ref<HTMLElement | null>(null);

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

    const panelClassList = computed(() => {
      return [
        props.panelClass,
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

      const hue = numberLimit((hsva.hue / 360) * 200, 0, 200);
      const saturation = numberLimit(hsva.saturation * 200, 0, 200);
      const value = numberLimit(200 - 200 * hsva.value, 0, 200);
      const alpha = numberLimit(200 - 200 * hsva.alpha, 0, 200);

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

    function onOpenChange(open: boolean) {
      if (!open) {
        changePropsValue(state.color);
      }
    }

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
      const language = environment.languageRef.value.colorPicker;

      function createTrigger() {
        const triggerProps = {
          disabled: !!props.disabled,
          color: state.color,
          environment,
        };

        const trigger = context.slots.trigger;

        let triggerNode = null;
        if (trigger) {
          triggerNode = () =>
            trigger({
              ...triggerProps,
            });
        }

        function onAssignRef(ref: Ref<HTMLElement | null>) {
          if (ref.value) {
            colorPickerTriggerAutoFocusRef.value = ref.value;
          }
        }

        return (
          <Trigger onAssignRef={onAssignRef} {...triggerProps}>
            {triggerNode}
          </Trigger>
        );
      }

      function createHsvPanel() {
        function onHsvMove(position: MovePosition): void {
          state.position.saturation = numberLimit(position.x, 0, 200);
          state.position.value = numberLimit(position.y, 0, 200);
          setColorFromPosition();
        }

        return (
          <HsvPanel
            color={state.color}
            hueReg={hueDegrees.value}
            saturation={state.position.saturation}
            value={state.position.value}
            onMove={onHsvMove}
          />
        );
      }

      function createHue() {
        function onHueMove(position: MovePosition): void {
          state.position.hue = numberLimit(position.y, 0, 200);
          setColorFromPosition();
        }

        return <HueSlide hue={state.position.hue} onMove={onHueMove} />;
      }

      function createAlpha() {
        if (!props.alpha) {
          return null;
        }

        function onAlphaMove(position: MovePosition): void {
          state.position.alpha = numberLimit(position.y, 0, 200);
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
            alpha={!!props.alpha}
            onColorInput={setColorAndPosition}
            onColorBlur={setColorAndPosition}
            environment={environment}
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
              role="button"
              aria-label={language.aria.switch}
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
        const hsvPanelNode = createHsvPanel();
        const slidesNode = createSlides();
        const formNode = createForm();
        const previewNode = createPreview();
        const presetNode = createPreset();

        function closeDropdown() {
          dropdownInstanceRef.value?.close();
        }

        const closeNode = (
          <div class="nova-color-picker-close-wrap">
            <div
              class="nova-color-picker-close"
              tabindex={0}
              role="button"
              aria-label={language.aria.close}
              onClick={closeDropdown}
            >
              <MDIClose />
            </div>
          </div>
        );

        const autoFocusNode = (
          <div
            class="nova-trap"
            ref={colorPickerPanelAutoFocusRef}
            tabindex={0}
          />
        );

        return (
          <div class="nova-color-picker-panel-inner">
            {autoFocusNode}
            {closeNode}
            {hsvPanelNode}
            {slidesNode}
            {formNode}
            {previewNode}
            {presetNode}
          </div>
        );
      }

      const triggerNode = createTrigger();
      const dropdownNode = createDropdown();

      const slots = {
        trigger: ({
          dropdownInstance,
          triggerAutoFocusRef,
        }: DropdownTriggerScoped) => {
          dropdownInstanceRef.value = dropdownInstance;
          triggerAutoFocusRef.value = colorPickerTriggerAutoFocusRef.value;
          return triggerNode;
        },
        default: ({ panelAutoFocusRef }: DropdownPanelScoped) => {
          panelAutoFocusRef.value = colorPickerPanelAutoFocusRef.value;
          return dropdownNode;
        },
      };

      return (
        <NovaDropdown
          class={classList.value}
          disabled={props.disabled}
          panelClass={panelClassList.value}
          panelStyle={props.panelStyle}
          panelProps={props.panelProps}
          teleportToBody={props.teleportToBody}
          placement={props.placement}
          environment={environment}
          onOpenChange={onOpenChange}
        >
          {slots}
        </NovaDropdown>
      );
    };
  },
};

export const NovaColorPicker = (NovaColorPickerImpl as unknown) as {
  new (): {
    $props: VNodeProps & ColorPickerProps & HTMLAttributes & VueComponentProps;
  };
};
