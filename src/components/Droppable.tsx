import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DroppableData } from '../types/dragAndDrop';

interface DroppableProps {
  id: string;
  children: (isOver: boolean) => React.ReactNode;
  data: DroppableData;
  disabled?: boolean;
}

export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
    disabled: props.disabled,
  });

  return <div ref={setNodeRef}>{props.children(isOver)}</div>;
}
