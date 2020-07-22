import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaButton, NovaColorPicker } from '../../../index';
import './styles/martrix.css';
import { Placement } from '../../../types/props';

export default defineComponent({
  setup() {
    const state = reactive({
      color: '#808080',
      placement: 'bottomLeft' as Placement,
    });

    function setPlacement(placement: Placement) {
      state.placement = placement;
    }

    return (): JSX.Element => {
      const pickerList = new Array(100).fill(null).map(() => {
        return (
          <li>
            <NovaColorPicker placement={state.placement} value={state.color} />
          </li>
        );
      });

      return (
        <div>
          <div>Placement: {state.placement}</div>
          <div class="demo-dropdown-matrix-placement">
            <div class="demo-dropdown-matrix-placement-top">
              <NovaButton onClick={() => setPlacement('topLeft')}>
                {() => 'Top Left'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('top')}>
                {() => 'Top'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('topRight')}>
                {() => 'Top Right'}
              </NovaButton>
            </div>
            <div class="demo-dropdown-matrix-placement-left">
              <NovaButton onClick={() => setPlacement('leftTop')}>
                {() => 'Left Top'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('left')}>
                {() => 'Left'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('leftBottom')}>
                {() => 'Left Bottom'}
              </NovaButton>
            </div>
            <div class="demo-dropdown-matrix-placement-right">
              <NovaButton onClick={() => setPlacement('rightTop')}>
                {() => 'Right Top'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('right')}>
                {() => 'Right'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('rightBottom')}>
                {() => 'Right Bottom'}
              </NovaButton>
            </div>
            <div class="demo-dropdown-matrix-placement-bottom">
              <NovaButton onClick={() => setPlacement('bottomLeft')}>
                {() => 'Bottom Left'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('bottom')}>
                {() => 'Bottom'}
              </NovaButton>
              <NovaButton onClick={() => setPlacement('bottomRight')}>
                {() => 'Bottom Right'}
              </NovaButton>
            </div>
          </div>
          <div class="demo-dropdown-matrix-box">
            <ul>{pickerList}</ul>
          </div>
        </div>
      );
    };
  },
});
