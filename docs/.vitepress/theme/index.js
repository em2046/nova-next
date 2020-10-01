import theme from 'vitepress/dist/client/theme-default';
import { NovaButton, NovaColorPicker, NovaInput } from '/@nova/';
import '/@nova/styles/index.css';
import './index.css';
import { registerComponents } from './register-components';

export default {
  ...theme,
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
    app.component(NovaButton.name, NovaButton);
    app.component(NovaInput.name, NovaInput);
    app.component(NovaColorPicker.name, NovaColorPicker);
    registerComponents(app);
  },
};
