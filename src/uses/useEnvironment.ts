import { inject, PropType, Ref, ref } from 'vue';
import { languageKey, themeKey } from '../utils/symbols';
import { Language } from '../environments/languages/type';
import enUS from '../environments/languages/en-US';

export const themeDefault = 'light';
export const languageDefault = enUS;

export const environmentProps = {
  theme: {
    type: String,
    default: null,
  },
  language: {
    type: Object as PropType<Language>,
    default: null,
  },
};

export type EnvironmentProps = { theme: string; language: Language };
export type Environment = { languageRef: Ref<Language>; themeRef: Ref<string> };

export default function useEnvironment(props: EnvironmentProps): Environment {
  let themeRef: Ref<string>;
  let languageRef: Ref<Language>;

  if (props.theme) {
    themeRef = ref(props.theme);
  } else {
    themeRef = inject(themeKey, ref(themeDefault));
  }

  if (props.language) {
    languageRef = ref(props.language);
  } else {
    languageRef = inject(languageKey, ref(languageDefault));
  }

  return {
    themeRef,
    languageRef,
  };
}
