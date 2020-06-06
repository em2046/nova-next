import { inject, ref, Ref } from 'vue';
import { Theme } from '../utils/symbols';

export const environmentProps = {
  theme: {
    type: String,
    default: null,
  },
};

type Props = { theme: string };
type Environment = { themeRef: Ref<string> };

export default function useEnvironment(props: Props): Environment {
  let themeRef: Ref<string>;
  if (props.theme) {
    themeRef = ref(props.theme);
  } else {
    themeRef = inject(Theme, ref('light'));
  }

  return {
    themeRef,
  };
}
