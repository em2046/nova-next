import { defineComponent, provide, ref, VNode, watch } from 'vue';
import { languageKey, themeKey } from '../../utils/symbols';
import {
  environmentProps,
  languageDefault,
  themeDefault,
} from '../../uses/useEnvironment';

export default defineComponent({
  props: environmentProps,
  setup(props, context) {
    const { slots } = context;

    const themeRef = props.theme ? ref(props.theme) : ref(themeDefault);
    const languageRef = props.language
      ? ref(props.language)
      : ref(languageDefault);

    provide(themeKey, themeRef);
    provide(languageKey, languageRef);

    watch(
      () => props.theme,
      (theme) => {
        if (!theme) {
          themeRef.value = themeDefault;
        } else {
          themeRef.value = theme;
        }
      }
    );

    watch(
      () => props.language,
      (language) => {
        if (!language) {
          languageRef.value = languageDefault;
        } else {
          languageRef.value = language;
        }
      }
    );

    return (): VNode[] | null => {
      const children = slots.default?.();

      if (!children) {
        return null;
      }

      return children;
    };
  },
});
