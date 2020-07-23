import { CSSProperties } from 'vue';

export interface VueProps {
  [key: string]: unknown;
}

export type VueStyle = string | CSSProperties;

export type VueClass = unknown;

export type Placement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'rightTop'
  | 'right'
  | 'rightBottom'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
  | 'leftTop'
  | 'left'
  | 'leftBottom';
