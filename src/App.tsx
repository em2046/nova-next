import { defineComponent, reactive, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { vueJsxCompat } from './vue-jsx-compat';
import { NovaButton, NovaEnvironment } from './index';
import zhCN from './environments/languages/zh-CN';
import enUS from './environments/languages/en-US';

const storageThemeKey = 'nova-theme';

type Direction = 'ltr' | 'rtl';

export default defineComponent({
  setup() {
    const state = reactive({
      theme: 'light',
      language: zhCN,
      direction: 'ltr' as Direction,
    });

    function initTheme() {
      const theme = localStorage.getItem(storageThemeKey);
      if (theme) {
        state.theme = theme;
      }
      setDocumentTheme(state.theme);
    }

    initTheme();

    function setDocumentTheme(theme: string) {
      document.documentElement.setAttribute('data-nova-theme', theme);
    }

    function setDocumentDirection(direction: Direction) {
      document.documentElement.setAttribute('dir', direction);
    }

    watch(
      () => state.theme,
      (theme) => {
        setDocumentTheme(theme);
      }
    );

    watch(
      () => state.direction,
      (direction) => {
        setDocumentDirection(direction);
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

    function setLtr() {
      state.direction = 'ltr';
    }

    function setRtl() {
      state.direction = 'rtl';
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
              <div>
                Direction: {state.direction}
                <NovaButton onClick={setLtr}>{() => 'ltr'}</NovaButton>
                <NovaButton onClick={setRtl}>{() => 'rtl'}</NovaButton>
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
