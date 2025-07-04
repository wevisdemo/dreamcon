import type { PointerEvent } from 'react';
import { PointerSensor } from '@dnd-kit/core';

/**
 * An extended "PointerSensor" that prevent some
 * interactive html element(button, input, textarea, select, option...) from dragging
 */
export class SmartPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target as Element)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function isInteractiveElement(element: Element | null) {
  if (element?.attributes.getNamedItem('data-dndkit-disable-drag')) {
    return true;
  }
  if (element?.classList.contains('MuiBackdrop-root')) {
    return true;
  }

  return false;
}
