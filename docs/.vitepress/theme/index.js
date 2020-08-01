import theme from '@em2046/vitepress/dist/client/theme-default';
import { NovaButton, NovaInput, NovaColorPicker } from '/@nova/';
import demoButtonBasic from '../components/demo/button/basic.vue';
import demoInputBasic from '../components/demo/input/basic.vue';
import demoColorPickerBasic from '../components/demo/color-picker/basic.vue';
import '/@nova/styles/index.css';
import './index.css';

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
    app.component(NovaButton.name, NovaButton);
    app.component(NovaInput.name, NovaInput);
    app.component(NovaColorPicker.name, NovaColorPicker);

    app.component('demo-button-basic', demoButtonBasic);
    app.component('demo-input-basic', demoInputBasic);
    app.component('demo-color-picker-basic', demoColorPickerBasic);
  },
};
