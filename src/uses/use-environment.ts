import { inject, Ref, ref } from 'vue';
import { languageKey, themeKey } from '../utils/symbols';
import { Language } from '../environments/languages/type';
import { enUS } from '../environments/languages';
import { EnvironmentProps } from '../components/environment/NovaEnvironment';

export const themeDefault = 'light';
export const languageDefault = enUS;

export type Environment = { languageRef: Ref<Language>; themeRef: Ref<string> };

export function useEnvironment(props: EnvironmentProps): Environment {
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
