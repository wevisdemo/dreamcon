import { useEffect, useState } from 'react';
import { withBase } from '../../const/app';
import { eventAvatars } from '../../data/event';
import {
  AddOrEditEventPayload,
  defaultAddOrEditEventPayload,
  DreamConEvent,
} from '../../types/event';
import Modal from '../ui/Modal';
import TagPicker from '../ui/TagPicker';

interface PropTypes {
  mode: 'create' | 'edit';
  defaultState?: DreamConEvent;
  isOpen: boolean;
  organizerOptions: string[];
  targetGroupTypeOptions: string[];
  onClose: () => void;
  onSubmit: (mode: 'create' | 'edit', payload: AddOrEditEventPayload) => void;
}

const inputClassName =
  'h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none';

export default function ModalEvent(props: PropTypes) {
  const [payload, setPayload] = useState<AddOrEditEventPayload>(
    defaultAddOrEditEventPayload
  );

  useEffect(() => {
    if (props.defaultState) {
      setPayload({
        id: props.defaultState.id,
        display_name: props.defaultState.display_name,
        avatar_url: props.defaultState.avatar_url,
        title_en: props.defaultState.title_en,
        title_th: props.defaultState.title_th,
        description: props.defaultState.description,
        location: props.defaultState.location,
        date: props.defaultState.date,
        target_group: props.defaultState.target_group,
        participants: props.defaultState.participants,
        news_link: props.defaultState.news_link,
        document_link: props.defaultState.document_link,
        organizers: props.defaultState.organizers,
        target_group_types: props.defaultState.target_group_types,
      });
    }
  }, [props.defaultState]);

  if (!props.isOpen) return null;

  const handleClose = () => {
    setPayload(defaultAddOrEditEventPayload);
    props.onClose();
  };

  /** Events saved before these fields existed may keep them empty when edited. */
  const isTagFieldRequired = (savedValues?: string[]) =>
    props.mode === 'create' || !!savedValues?.length;

  const validatePayload = (payload: AddOrEditEventPayload | null): boolean => {
    if (!payload) return false;
    if (!payload.display_name) return false;
    if (!payload.avatar_url) return false;
    if (!payload.description) return false;
    if (!payload.location) return false;
    if (!payload.date) return false;
    if (!payload.target_group) return false;
    if (!payload.participants) return false;
    if (
      isTagFieldRequired(props.defaultState?.organizers) &&
      payload.organizers.length === 0
    )
      return false;
    if (
      isTagFieldRequired(props.defaultState?.target_group_types) &&
      payload.target_group_types.length === 0
    )
      return false;
    return true;
  };

  const getConfirmStyle = () =>
    validatePayload(payload)
      ? 'rounded-full py-2.5 px-4 bg-blue-6 text-button text-white wv-ibmplex wv-bold shadow-md'
      : 'rounded-full py-2.5 px-4 bg-gray-2 text-button text-gray-5 wv-ibmplex wv-bold';

  const onSubmit = () => {
    switch (props.mode) {
      case 'create':
        props.onSubmit(props.mode, payload);
        break;
      case 'edit':
        props.onSubmit(props.mode, { ...payload, id: props.defaultState?.id });
        break;
    }
    handleClose();
  };

  const convertToThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('th-TH', options);
    const formattedDate = formatter.format(date);
    return formattedDate.replace(/(\d+)(th)/, '$1');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <Modal
        title={props.mode === 'edit' ? 'แก้ไขข้อมูลวงสนทนา' : 'เพิ่มวงสนทนาใหม่'}
        onClose={handleClose}
        wide
      >
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center justify-between gap-4">
            <div className="w-1/2">
              <label className="mb-3 block text-blue-7">ชื่อที่แสดง*</label>
              <input
                type="text"
                value={payload?.display_name || ''}
                onChange={e =>
                  setPayload({ ...payload, display_name: e.target.value })
                }
                className={inputClassName}
                placeholder="ชื่อสั้นๆ ที่จะปรากฏพร้อมข้อถกเถียง"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-3 block text-blue-7">รูปภาพ*</label>
              <div className="flex flex-nowrap gap-2 overflow-x-scroll">
                {eventAvatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={withBase(avatar)}
                    alt={`Avatar ${index}`}
                    className={`h-8.75 w-8.75 cursor-pointer rounded-full ${
                      payload.avatar_url === avatar
                        ? 'border-2 border-gray-8'
                        : ''
                    }`}
                    onClick={() =>
                      setPayload({ ...payload, avatar_url: avatar })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-blue-7">
              ชื่อเต็ม ภาษาอังกฤษ (ถ้ามี)
            </label>
            <input
              type="text"
              className={inputClassName}
              onChange={e =>
                setPayload({ ...payload, title_en: e.target.value })
              }
              value={payload?.title_en || ''}
              placeholder="ชื่อเต็มภาษาอังกฤษ"
            />
          </div>
          <div>
            <label className="mb-3 block text-blue-7">
              ชื่อเต็ม ภาษาไทย (ถ้ามี)
            </label>
            <input
              type="text"
              className={inputClassName}
              onChange={e =>
                setPayload({ ...payload, title_th: e.target.value })
              }
              value={payload?.title_th || ''}
              placeholder="ชื่อเต็มภาษาไทย"
            />
          </div>
          <div>
            <label className="mb-3 block text-blue-7">คำอธิบาย*</label>
            <textarea
              rows={3}
              value={payload?.description || ''}
              onChange={e =>
                setPayload({ ...payload, description: e.target.value })
              }
              className="w-full resize-none rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
              placeholder="คำอธิบาย"
            ></textarea>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">ลิงก์ข่าว (ถ้ามี)</label>
              <input
                type="text"
                className={inputClassName}
                onChange={e =>
                  setPayload({ ...payload, news_link: e.target.value })
                }
                value={payload?.news_link || ''}
                placeholder="เช่น โพสต์ประชาสัมพันธ์ / โพสต์ภาพบรรยากาศในงาน"
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">
                ลิงก์เอกสารกิจกรรม (ถ้ามี)
              </label>
              <input
                type="text"
                className={inputClassName}
                onChange={e =>
                  setPayload({ ...payload, document_link: e.target.value })
                }
                value={payload?.document_link || ''}
                placeholder="เช่น เอกสารกำหนดการ / รายงานสรุปกิจกรรม"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">สถานที่*</label>
              <input
                type="text"
                className={inputClassName}
                onChange={e =>
                  setPayload({ ...payload, location: e.target.value })
                }
                value={payload?.location || ''}
                placeholder="ชื่อสถานที่และจังหวัด"
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">วันที่จัด*</label>
              <div className="relative">
                <span
                  className={`pointer-events-none absolute inset-y-px right-8 left-px flex items-center truncate rounded-l-lg bg-gray-1 px-2.5 ${
                    payload.date ? '' : 'text-gray-5'
                  }`}
                >
                  {payload?.date ? convertToThaiDate(payload.date) : 'วันที่จัด'}
                </span>
                <input
                  type="date"
                  className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 px-2.5 focus:outline-none"
                  onClick={e => e.currentTarget.showPicker()}
                  onChange={e =>
                    setPayload({ ...payload, date: e.target.value })
                  }
                  value={payload.date}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">ชื่อองค์กรที่จัด*</label>
              <TagPicker
                label="ชื่อองค์กรที่จัด"
                options={props.organizerOptions}
                selected={payload.organizers}
                onChange={organizers => setPayload({ ...payload, organizers })}
                placeholder="เลือกองค์กร"
                hint="เลือกได้มากกว่า 1 องค์กร หรือสร้างเพิ่ม"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="mb-3 block text-blue-7">จำนวนผู้เข้าร่วม*</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  className="h-8.75 w-20 rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
                  placeholder="ตัวเลข"
                  min="0"
                  onChange={e =>
                    setPayload({
                      ...payload,
                      participants: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  value={payload?.participants || ''}
                />
                <span className="text-gray-5">คน</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">กลุ่มเป้าหมาย*</label>
              <input
                type="text"
                className={inputClassName}
                placeholder="บรรยายลักษณะของผู้ที่เข้าร่วม"
                onChange={e =>
                  setPayload({ ...payload, target_group: e.target.value })
                }
                value={payload?.target_group || ''}
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">
                ประเภทกลุ่มเป้าหมาย*
              </label>
              <TagPicker
                label="ประเภทกลุ่มเป้าหมาย"
                options={props.targetGroupTypeOptions}
                selected={payload.target_group_types}
                onChange={target_group_types =>
                  setPayload({ ...payload, target_group_types })
                }
                placeholder="เลือกประเภท"
                hint="เลือกได้มากกว่า 1 ประเภท หรือสร้างเพิ่ม"
              />
            </div>
          </div>
          <button
            className={getConfirmStyle()}
            onClick={onSubmit}
            disabled={validatePayload(payload) ? false : true}
          >
            {props.mode === 'edit' ? 'แก้ไข' : 'เพิ่ม'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
