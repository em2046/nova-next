import demoButtonBasic from '../components/demo/button/basic.vue';
import demoColorPickerBasic from '../components/demo/color-picker/basic.vue';
import demoInputBasic from '../components/demo/input/basic.vue';

export function registerComponents(app) {
  app.component('demoButtonBasic', demoButtonBasic);
  app.component('demoColorPickerBasic', demoColorPickerBasic);
  app.component('demoInputBasic', demoInputBasic);
}
