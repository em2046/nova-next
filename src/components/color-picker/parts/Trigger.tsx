import { computed, defineComponent, onMounted, ref } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';

export default defineComponent({
  name: 'Trigger',
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const triggerRef = ref(null);

    const triggerInnerStyle = computed(() => {
      return {
        backgroundColor: props.color.toCssRgbaString(),
      };
    });

    onMounted(() => {
      emit('assignRef', triggerRef);
    });

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-trigger" ref={triggerRef}>
          <div class="nova-color-picker-trigger-inner">
            <div
              class="nova-color-picker-trigger-bg"
              style={triggerInnerStyle.value}
            />
          </div>
        </div>
      );
    };
  },
});
