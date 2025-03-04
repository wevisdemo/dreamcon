import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Comment } from "../types/comment";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  data: Comment;
}

export function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
    data: props.data,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}
