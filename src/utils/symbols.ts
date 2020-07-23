import { InjectionKey, Ref } from 'vue';
import { Language } from '../types/language';

export const themeKey = Symbol('theme') as InjectionKey<Ref<string>>;
export const languageKey = Symbol('language') as InjectionKey<Ref<Language>>;
