import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaDropdown } from '../../../components/dropdown';
import { NovaButton } from '../../../components/button';
import './styles/normal.css';

export default defineComponent({
  setup() {
    const slots = {
      trigger: () => {
        return <NovaButton>{() => 'Open'}</NovaButton>;
      },
      default: () => {
        return (
          <ul class="demo-dropdown-normal-menu">
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
          </ul>
        );
      },
    };

    return (): JSX.Element => {
      return (
        <div>
          <NovaDropdown>{slots}</NovaDropdown>
          <NovaDropdown>{slots}</NovaDropdown>
        </div>
      );
    };
  },
});
