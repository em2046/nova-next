import { VisualViewport } from '../shims/visual-viewport';
import { Placement } from '../types/props';

type MainAxisPlacement = 'start' | 'center' | 'end';
type CrossAxisPlacement = 'start' | 'end';

interface getAxisPlaceParams {
  oldStart: number;
  oldEnd: number;
  newLength: number;
  minLength: number;
  maxLength: number;
}

export interface Offset {
  left: number;
  top: number;
}

export function place(
  oldRect: DOMRect,
  newRect: DOMRect,
  visualViewport: VisualViewport,
  placement: Placement
): Offset {
  const viewportWidth = visualViewport.width;
  const viewportHeight = visualViewport.height;
  const pageLeft = visualViewport.pageLeft;
  const pageTop = visualViewport.pageTop;

  const newWidth = newRect.width;
  const newHeight = newRect.height;

  const oldLeft = oldRect.left + pageLeft;
  const oldTop = oldRect.top + pageTop;
  const oldRight = oldRect.right + pageLeft;
  const oldBottom = oldRect.bottom + pageTop;

  const maxWidth = viewportWidth + pageLeft;
  const maxHeight = viewportHeight + pageTop;

  const verticalParams = {
    oldStart: oldTop,
    oldEnd: oldBottom,
    newLength: newHeight,
    minLength: pageTop,
    maxLength: maxHeight,
  };

  const horizontalParams = {
    oldStart: oldLeft,
    oldEnd: oldRight,
    newLength: newWidth,
    minLength: pageLeft,
    maxLength: maxWidth,
  };

  const getMainVerticalStart = () => getMainAxisPlace(verticalParams, 'start');
  const getMainVerticalCenter = () =>
    getMainAxisPlace(verticalParams, 'center');
  const getMainVerticalEnd = () => getMainAxisPlace(verticalParams, 'end');

  const getMainHorizontalStart = () =>
    getMainAxisPlace(horizontalParams, 'start');
  const getMainHorizontalCenter = () =>
    getMainAxisPlace(horizontalParams, 'center');
  const getMainHorizontalEnd = () => getMainAxisPlace(horizontalParams, 'end');

  const getCrossVerticalStart = () =>
    getCrossAxisPlace(verticalParams, 'start');
  const getCrossVerticalEnd = () => getCrossAxisPlace(verticalParams, 'end');

  const getCrossHorizontalEnd = () =>
    getCrossAxisPlace(horizontalParams, 'end');
  const getCrossHorizontalStart = () =>
    getCrossAxisPlace(horizontalParams, 'start');

  let left;
  let top;

  switch (placement) {
    case 'topLeft':
      left = getMainHorizontalStart();
      top = getCrossVerticalStart();
      break;
    case 'top':
      left = getMainHorizontalCenter();
      top = getCrossVerticalStart();
      break;
    case 'topRight':
      left = getMainHorizontalEnd();
      top = getCrossVerticalStart();
      break;
    case 'bottomLeft':
      left = getMainHorizontalStart();
      top = getCrossVerticalEnd();
      break;
    case 'bottom':
      left = getMainHorizontalCenter();
      top = getCrossVerticalEnd();
      break;
    case 'bottomRight':
      left = getMainHorizontalEnd();
      top = getCrossVerticalEnd();
      break;
    case 'leftTop':
      left = getCrossHorizontalStart();
      top = getMainVerticalStart();
      break;
    case 'left':
      left = getCrossHorizontalStart();
      top = getMainVerticalCenter();
      break;
    case 'leftBottom':
      left = getCrossHorizontalStart();
      top = getMainVerticalEnd();
      break;
    case 'rightTop':
      left = getCrossHorizontalEnd();
      top = getMainVerticalStart();
      break;
    case 'right':
      left = getCrossHorizontalEnd();
      top = getMainVerticalCenter();
      break;
    case 'rightBottom':
      left = getCrossHorizontalEnd();
      top = getMainVerticalEnd();
      break;
  }

  return {
    left,
    top,
  };
}

function getMainAxisPlace(
  params: getAxisPlaceParams,
  placement: MainAxisPlacement
) {
  const { oldStart, oldEnd, newLength, minLength, maxLength } = params;
  if (newLength > maxLength - minLength) {
    return minLength;
  }

  let newStart;

  switch (placement) {
    case 'start':
      newStart = oldStart;
      break;
    case 'center':
      newStart = oldEnd - (oldEnd - oldStart) / 2 - newLength / 2;
      break;
    case 'end':
      newStart = oldEnd - newLength;
      break;
  }

  if (newStart + newLength > maxLength) {
    newStart = maxLength - newLength;
  }
  if (newStart < minLength) {
    newStart = minLength;
  }

  return newStart;
}

function getCrossAxisPlace(
  params: getAxisPlaceParams,
  placement: CrossAxisPlacement
) {
  const { oldStart, oldEnd, newLength, minLength, maxLength } = params;
  if (newLength > maxLength - minLength) {
    return minLength;
  }

  let newStart;

  switch (placement) {
    case 'start':
      newStart = oldStart - newLength;
      if (newStart < minLength) {
        newStart = oldEnd;
      }
      break;
    case 'end':
      newStart = oldEnd;
      if (newStart + newLength > maxLength) {
        newStart = oldStart - newLength;
      }
      break;
  }

  if (newStart < minLength) {
    newStart = minLength;
  }

  return newStart;
}
