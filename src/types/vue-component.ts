// Copy from @vue/runtime-dom/dist/runtime-dom.d.ts

import { AllowedComponentProps, Events } from 'vue';

type StringKeyOf<T> = Extract<keyof T, string>;

type EventHandlers<E> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in StringKeyOf<E>]?: E[K] extends Function
    ? E[K]
    : (payload: E[K]) => void;
};

export type VueComponentProps = EventHandlers<Events> & AllowedComponentProps;
