import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { NovaButton } from '../../index';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MDI3DRotation } from '@em2046/material-design-icons-vue-next';

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
        <NovaButton>{() => <MDI3DRotation />}</NovaButton>
        <NovaButton />
      </section>
    );
  },
});
