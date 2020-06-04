import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import Normal from './color-picker/Normal';
import NovaEnvironment from '../../components/environment/NovaEnvironment';
import Alpha from './color-picker/Alpha';
import Hsla from './color-picker/Hsla';
import VModel from './color-picker/VModel.vue';

export default defineComponent({
  setup() {
    const state = reactive({
      theme: 'light',
    });

    function setLight() {
      state.theme = 'light';
    }

    function setDark() {
      state.theme = 'dark';
    }

    return (): JSX.Element => (
      <section data-theme={state.theme} class="color-picker-demo">
        <button onClick={setLight}>Light</button>
        <button onClick={setDark}>Dark</button>
        {state.theme}
        <NovaEnvironment theme={state.theme}>
          {() => {
            return [<Normal />, <Alpha />, <Hsla />, <VModel />];
          }}
        </NovaEnvironment>
      </section>
    );
  },
});
