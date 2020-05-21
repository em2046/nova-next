import { defineComponent, h } from 'vue';

export default defineComponent({
  setup() {
    return (): unknown => <h1>About page!</h1>;
  },
});
