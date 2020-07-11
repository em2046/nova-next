import { defineComponent, reactive, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { vueJsxCompat } from './vue-jsx-compat';
import { NovaButton, NovaEnvironment } from './index';
import zhCN from './environments/languages/zh-CN';
import enUS from './environments/languages/en-US';

const storageThemeKey = 'nova-theme';

export default defineComponent({
  setup() {
    const state = reactive({
      theme: 'light',
      language: zhCN,
    });

    function initTheme() {
      const theme = localStorage.getItem(storageThemeKey);
      if (theme) {
        state.theme = theme;
      }
      setBodyTheme(state.theme);
    }

    initTheme();

    function setBodyTheme(theme: string) {
      document.documentElement.setAttribute('data-nova-theme', theme);
    }

    watch(
      () => state.theme,
      (theme) => {
        setBodyTheme(theme);
      }
    );

    function setTheme(theme: string) {
      state.theme = theme;
      localStorage.setItem(storageThemeKey, theme);
    }

    function setLight() {
      setTheme('light');
    }

    function setDark() {
      setTheme('dark');
    }

    function setZhCn() {
      state.language = zhCN;
    }

    function setEnUs() {
      state.language = enUS;
    }

    return (): JSX.Element => (
      <NovaEnvironment theme={state.theme} language={state.language}>
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
                  <RouterLink to="/button">{(): string => 'Button'}</RouterLink>
                </li>
                <li>
                  <RouterLink to="/input">{(): string => 'Input'}</RouterLink>
                </li>
                <li>
                  <RouterLink to="/about">{(): string => 'About'}</RouterLink>
                </li>
              </ul>
              <div>
                Theme: {state.theme}
                <NovaButton theme="light" onClick={setLight}>
                  {() => 'Light'}
                </NovaButton>
                <NovaButton theme="dark" onClick={setDark}>
                  {() => 'Dark'}
                </NovaButton>
              </div>
              <div>
                Language: {state.language.name}
                <NovaButton onClick={setZhCn}>{() => 'zh-CN'}</NovaButton>
                <NovaButton onClick={setEnUs}>{() => 'en-US'}</NovaButton>
              </div>
            </nav>
          </header>,
          <main id="main">
            <RouterView />
          </main>,
        ]}
      </NovaEnvironment>
    );
  },
});
