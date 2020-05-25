import { Ref } from 'vue';
import useMousemove from './useMousemove';
import useTouchmove from './useTouchmove';

export interface MovePosition {
  x: number;
  y: number;
}

export interface MoveParams {
  ref: Ref<HTMLElement | null>;
  start?: () => void;
  move?: (position: MovePosition) => void;
  finish?: () => void;
}

export default function useMove(params: MoveParams): void {
  useMousemove(params);
  useTouchmove(params);
}
