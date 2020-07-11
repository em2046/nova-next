import { provide, ref, SetupContext, VNode, VNodeProps, watch } from 'vue';
import { languageKey, themeKey } from '../../utils/symbols';
import {
  environmentProps,
  languageDefault,
  NovaEnvironmentProps,
  themeDefault,
} from '../../uses/use-environment';

const NovaEnvironmentImpl = {
  props: environmentProps,
  setup(props: NovaEnvironmentProps, context: SetupContext) {
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
};

export const NovaEnvironment = (NovaEnvironmentImpl as unknown) as {
  new (): {
    $props: VNodeProps & NovaEnvironmentProps;
  };
};
