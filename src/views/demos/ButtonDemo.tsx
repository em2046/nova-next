import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { NovaButton } from '../../index';
import { MDICamera, MDITheaters } from '@em2046/material-design-icons-vue-next';

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
        <NovaButton>{{ icon: (): string => '🚀' }}</NovaButton>
        <NovaButton>{{ icon: () => <MDICamera /> }}</NovaButton>
        <NovaButton>
          {{ icon: () => <MDICamera />, default: () => 'Camera' }}
        </NovaButton>
        <NovaButton>{{ icon: () => <MDITheaters /> }}</NovaButton>
        <NovaButton>
          {{ icon: () => <MDITheaters />, default: () => 'Theaters' }}
        </NovaButton>
        <NovaButton />
      </section>
    );
  },
});
