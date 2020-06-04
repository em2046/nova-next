<script>
import { defineComponent, reactive } from 'vue';
import { NovaColorPicker } from '../../../index';

export default defineComponent({
  components: {
    NovaColorPicker,
  },
  setup() {
    const state = reactive({
      color: '#808080',
    });

    return {
      state,
    };
  },
});
</script>

<template>
  <div>
    <div id="print">
      {{ state.color }}
    </div>
    <NovaColorPicker
      v-model:value="state.color"
      theme="dark"
    />
  </div>
</template>
