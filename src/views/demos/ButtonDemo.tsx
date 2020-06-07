import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { NovaButton } from '../../index';

export default defineComponent({
  setup() {
    function handleClick(e: MouseEvent) {
      console.log(e);
    }

    return (): JSX.Element => (
      <section>
        <NovaButton name="button" onClick={handleClick}>
          {(): string => 'primary'}
        </NovaButton>
        <NovaButton type="submit">{(): string => 'Secondary'}</NovaButton>
        <NovaButton disabled>{(): string => 'Link'}</NovaButton>
        <NovaButton>{(): string => '简体中文'}</NovaButton>
        <NovaButton>{(): string => '🚀'}</NovaButton>
        <NovaButton />
      </section>
    );
  },
});
