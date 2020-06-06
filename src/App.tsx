import { defineComponent, reactive } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { vueJsxCompat } from './vue-jsx-compat';
import { storageThemeKey } from './utils/symbols';
import NovaEnvironment from './components/environment/NovaEnvironment';

export default defineComponent({
  setup() {
    const state = reactive({
      theme: 'light',
    });

    function initTheme() {
      const theme = localStorage.getItem(storageThemeKey);
      if (theme) {
        state.theme = theme;
      }
    }

    initTheme();

    function setLight() {
      const theme = 'light';
      state.theme = theme;
      localStorage.setItem(storageThemeKey, theme);
    }

    function setDark() {
      const theme = 'dark';
      state.theme = theme;
      localStorage.setItem(storageThemeKey, theme);
    }

    return (): JSX.Element => (
      <article id="page" data-nova-theme={state.theme}>
        <NovaEnvironment theme={state.theme}>
          {() => [
            <header id="header">
              <nav id="nav">
                <ul>
                  <li>
                    <RouterLink to="/">{(): string => 'Home'}</RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/color-picker">
                      {(): string => 'ColorPicker'}
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/dropdown">
                      {(): string => 'Dropdown'}
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/button">
                      {(): string => 'Button'}
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/input">{(): string => 'Input'}</RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/about">{(): string => 'About'}</RouterLink>
                  </li>
                </ul>
                Theme: {state.theme}
                <button onClick={setLight}>Light</button>
                <button onClick={setDark}>Dark</button>
              </nav>
            </header>,
            <main id="main">
              <RouterView />
            </main>,
          ]}
        </NovaEnvironment>
      </article>
    );
  },
});
