import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { NovaButton, NovaInput } from '../../index';

export default defineComponent({
  setup() {
    const state = reactive({
      required: false,
    });

    function toggleRequired() {
      state.required = !state.required;
    }

    function handleInput(e: Event) {
      console.log(e);
    }

    return (): JSX.Element => (
      <section>
        <div>
          <NovaInput
            wrapClass="my-custom-wrap-class-name"
            class="my-custom-class-name"
            wrapStyle={{ margin: '10px' }}
            style={{ fontSize: '12px' }}
            id="name"
            name="name"
            required={state.required}
            minlength={4}
            maxlength={4}
            size={10}
            onInput={handleInput}
          />
          <NovaButton onClick={toggleRequired}>
            {() => 'Toggle required'}
          </NovaButton>
        </div>
        <div>
          <NovaInput disabled />
          <NovaInput readonly value="Text" />
          <NovaInput value="✒" />
        </div>
      </section>
    );
  },
});
