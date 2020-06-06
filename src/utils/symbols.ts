import { InjectionKey, Ref } from 'vue';

export const Theme = Symbol('theme') as InjectionKey<Ref<string>>;
export const storageThemeKey = 'nova-theme';
