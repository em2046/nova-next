import { RouterLink, RouterView } from 'vue-router';
import { defineComponent } from 'vue';
import { vueJsxCompat } from './vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): unknown => [
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
              <RouterLink to="/button">{(): string => 'Button'}</RouterLink>
            </li>
            <li>
              <RouterLink to="/input">{(): string => 'Input'}</RouterLink>
            </li>
            <li>
              <RouterLink to="/about">{(): string => 'About'}</RouterLink>
            </li>
          </ul>
        </nav>
      </header>,
      <main id="main">
        <RouterView />
      </main>,
    ];
  },
});
