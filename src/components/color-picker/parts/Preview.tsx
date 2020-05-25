import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import Color from '../color';

export default defineComponent({
  name: 'Preview',
  props: {
    color: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    function onPrevClick(): void {
      emit('reset');
    }

    return (): JSX.Element => {
      const prevColor = Color.parse(props.value).toCssRgbaString();
      const currColor = props.color.toCssRgbaString();
      const prevStyle = {
        backgroundColor: prevColor,
      };
      const currStyle = {
        backgroundColor: currColor,
      };

      return (
        <div class="nova-color-picker-preview">
          <div class="nova-color-picker-preview-fill-left" />
          <div class="nova-color-picker-preview-fill-right" />
          <div
            class="nova-color-picker-preview-prev"
            style={prevStyle}
            onClick={onPrevClick}
          />
          <div class="nova-color-picker-preview-curr" style={currStyle} />
        </div>
      );
    };
  },
});
