import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import useEnvironment, {
  EnvironmentProps,
  environmentProps,
} from '../../uses/useEnvironment';

export default defineComponent({
  name: 'NovaInput',
  props: {
    ...environmentProps,
  },
  setup(props) {
    const environment = useEnvironment((props as unknown) as EnvironmentProps);

    return (): JSX.Element => {
      return (
        <div
          class="nova-input-wrap"
          data-nova-theme={environment.themeRef.value}
        >
          <input type="text" class="nova-input" />
        </div>
      );
    };
  },
});
