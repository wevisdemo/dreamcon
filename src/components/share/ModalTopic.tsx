import {
  ModalTopicPayload,
  Topic,
  topicCategories,
  TopicCategory,
} from '../../types/topic';
import React, { useEffect, useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Dropdown from './Dropdown';
import { DreamConEvent } from '../../types/event';
interface PropTypes {
  mode: 'create' | 'edit';
  createdByEvent: DreamConEvent;
  defaultState?: Topic;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mode: 'create' | 'edit', payload: ModalTopicPayload) => void;
}

export default function ModalTopic(props: PropTypes) {
  const [text, setText] = useState<string>('');
  const [category, setCategory] = useState<TopicCategory | ''>('');

  useEffect(() => {
    setText(props.defaultState?.title || '');
    setCategory((props.defaultState?.category as TopicCategory) || '');
  }, [props.defaultState]);

  if (!props.isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    setCategory('');
    props.onClose();
  };

  const onSubmit = () => {
    switch (props.mode) {
      case 'create':
        props.onSubmit(props.mode, {
          title: text,
          event_ids: props.defaultState?.event_ids,
          category: category === '' ? 'ไม่ระบุ' : category,
        });
        break;
      case 'edit':
        props.onSubmit(props.mode, {
          id: props.defaultState?.id,
          title: text,
          category: category === '' ? 'ไม่ระบุ' : category,
          event_ids: props.defaultState?.event_ids,
        });
        break;
    }
    handleClose();
  };

  const canSubmit = () => {
    return text !== '';
  };

  return (
    <div
      className="w-full h-screen inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full md:max-w-120 bg-white md:rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 mt-2 border-solid border-b border-gray-3 relative">
          <Dropdown
            onSelect={v => setCategory(v as TopicCategory)}
            options={topicCategories}
            placeholder="เลือกหัวข้อ"
          />
          <p className="absolute wv-ibmplex text-b2 text-blue-7 wv-bold left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2 bg-white px-2">
            {props.mode === 'create'
              ? 'เพิ่มข้อถกเถียงใหม่'
              : 'แก้ไขข้อถกเถียง'}
          </p>

          <div
            className="text-gray-5 wv-ibmplex underline hover:cursor-pointer"
            onClick={handleClose}
          >
            ยกเลิก
          </div>
        </div>

        <div className="p-4 h-full flex flex-col">
          <div className="flex gap-2 items-center">
            <img
              className="rounded-full w-6.25 h-6.25"
              src={props.createdByEvent.avatar_url}
              alt={`avatar-event-${props.createdByEvent.display_name}`}
            />
            <span className="text-label-sm wv-bold">
              {props.createdByEvent.display_name}
            </span>
          </div>
          <div className="w-full rounded-[5px] border border-gray-1 overflow-hidden mt-4">
            <div className="px-2.5 py-2 bg-gray-2">คุณมีข้อถกเถียงว่า...</div>
            <div className="w-full bg-gray-1 relative">
              <TextareaAutosize
                id="topic-title-text-area"
                className="w-full bg-gray-1 p-2.5 text-black resize-none overflow-hidden focus:outline-none"
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
                maxLength={140}
                placeholder="ข้อถกเถียงควรประกอบด้วยเหตุผลและข้อสรุป (140 ตัวอักษร)"
              />
              {canSubmit() && (
                <img
                  className="w-4.5 h-4.5 absolute bottom-2.5 right-2.5 hover:cursor-pointer"
                  src="/icon/upload.svg"
                  alt="upload-icon"
                  onClick={onSubmit}
                />
              )}
            </div>
          </div>
          <span className="text-gray-7">{text.length}/140</span>
        </div>
      </div>
    </div>
  );
}
