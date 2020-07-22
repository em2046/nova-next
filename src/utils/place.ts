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

  const mainVerticalStart = getMainAxisPlace(verticalParams, 'start');
  const mainVerticalCenter = getMainAxisPlace(verticalParams, 'center');
  const mainVerticalEnd = getMainAxisPlace(verticalParams, 'end');

  const mainHorizontalStart = getMainAxisPlace(horizontalParams, 'start');
  const mainHorizontalCenter = getMainAxisPlace(horizontalParams, 'center');
  const mainHorizontalEnd = getMainAxisPlace(horizontalParams, 'end');

  const crossVerticalStart = getCrossAxisPlace(verticalParams, 'start');
  const crossVerticalEnd = getCrossAxisPlace(verticalParams, 'end');

  const crossHorizontalEnd = getCrossAxisPlace(horizontalParams, 'end');
  const crossHorizontalStart = getCrossAxisPlace(horizontalParams, 'start');

  let left;
  let top;

  switch (placement) {
    case 'topLeft':
      left = mainHorizontalStart;
      top = crossVerticalStart;
      break;
    case 'top':
      left = mainHorizontalCenter;
      top = crossVerticalStart;
      break;
    case 'topRight':
      left = mainHorizontalEnd;
      top = crossVerticalStart;
      break;
    case 'bottomLeft':
      left = mainHorizontalStart;
      top = crossVerticalEnd;
      break;
    case 'bottom':
      left = mainHorizontalCenter;
      top = crossVerticalEnd;
      break;
    case 'bottomRight':
      left = mainHorizontalEnd;
      top = crossVerticalEnd;
      break;
    case 'leftTop':
      left = crossHorizontalStart;
      top = mainVerticalStart;
      break;
    case 'left':
      left = crossHorizontalStart;
      top = mainVerticalCenter;
      break;
    case 'leftBottom':
      left = crossHorizontalStart;
      top = mainVerticalEnd;
      break;
    case 'rightTop':
      left = crossHorizontalEnd;
      top = mainVerticalStart;
      break;
    case 'right':
      left = crossHorizontalEnd;
      top = mainVerticalCenter;
      break;
    case 'rightBottom':
      left = crossHorizontalEnd;
      top = mainVerticalEnd;
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
