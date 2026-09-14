import {
  disabledCategories,
  ModalTopicPayload,
  Topic,
  topicCategories,
  TopicCategory,
} from '../../types/topic';
import { useEffect, useState } from 'react';
import Dropdown from '../ui/Dropdown';
import { DreamConEvent } from '../../types/event';
import TextComposer from '../ui/TextComposer';
import Modal from '../ui/Modal';

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
  const [categories, setCategories] = useState<TopicCategory[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const showCategoryError = submitted && categories.length === 0;

  useEffect(() => {
    setText(props.defaultState?.title || '');
    setCategories((props.defaultState?.categories as TopicCategory[]) || []);
  }, [props.defaultState]);

  if (!props.isOpen) return null;

  const handleClose = () => {
    setText('');
    setCategories([]);
    setSubmitted(false);
    props.onClose();
  };

  const onSubmit = () => {
    setSubmitted(true);
    if (categories.length === 0) return;

    switch (props.mode) {
      case 'create':
        props.onSubmit(props.mode, {
          title: text,
          event_ids: props.defaultState?.event_ids,
          categories,
        });
        break;
      case 'edit':
        props.onSubmit(props.mode, {
          id: props.defaultState?.id,
          title: text,
          categories,
          event_ids: props.defaultState?.event_ids,
        });
        break;
    }
    handleClose();
  };

  return (
    <Modal
      title={
        props.mode === 'create' ? 'เพิ่มข้อถกเถียงใหม่' : 'แก้ไขข้อถกเถียง'
      }
      onClose={handleClose}
    >
      <Dropdown
        selected={categories}
        onChange={c => setCategories(c as TopicCategory[])}
        options={topicCategories}
        disabledOptions={disabledCategories(categories)}
        placeholder="เลือกหัวข้อ"
      />
      <TextComposer
        id="topic-title-text-area"
        label="ข้อถกเถียงของ"
        eventName={props.createdByEvent.display_name}
        value={text}
        onChange={setText}
        onSubmit={onSubmit}
        placeholder="ข้อถกเถียงควรประกอบด้วยเหตุผลและข้อสรุป (140 ตัวอักษร)"
        autoFocus
      />
      {showCategoryError && (
        <span className="text-label text-center text-red-6">
          *ยังไม่ได้เลือกหัวข้อ
        </span>
      )}
    </Modal>
  );
}
