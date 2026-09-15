import React, { useEffect, useState } from 'react';
import { eventAvatars } from '../../data/event';
import {
  AddOrEditEventPayload,
  defaultAddOrEditEventPayload,
  DreamConEvent,
} from '../../types/event';

interface PropTypes {
  mode: 'create' | 'edit';
  defaultState?: DreamConEvent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mode: 'create' | 'edit', payload: AddOrEditEventPayload) => void;
}

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
      });
    }
  }, [props.defaultState]);

  if (!props.isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setPayload(defaultAddOrEditEventPayload);
    props.onClose();
  };

  const validatePayload = (payload: AddOrEditEventPayload | null): boolean => {
    if (!payload) return false;
    if (!payload.display_name) return false;
    if (!payload.avatar_url) return false;
    if (!payload.title_en) return false;
    if (!payload.title_th) return false;
    if (!payload.description) return false;
    if (!payload.location) return false;
    if (!payload.date) return false;
    if (!payload.target_group) return false;
    if (!payload.participants) return false;
    if (!payload.news_link) return false;
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
    <div
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="h-auto w-full max-w-207.5 bg-white shadow-lg md:rounded-lg">
        <div className="relative flex items-center border-b border-solid border-gray-3 px-4 pt-6 pb-4">
          <h2 className="wv-ibmplex wv-bold w-full flex-1 text-center heading-5 text-blue-7">
            {props.mode === 'edit' ? 'แก้ไขข้อมูลวงสนทนา' : 'เพิ่มวงสนทนาใหม่'}
          </h2>
          <button
            className="wv-ibmplex absolute right-4 text-label text-gray-5 underline"
            onClick={handleClose}
          >
            ยกเลิก
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-1/2">
              <label className="mb-3 block text-blue-7">ชื่อที่แสดง</label>
              <input
                type="text"
                value={payload?.display_name || ''}
                onChange={e =>
                  setPayload({ ...payload, display_name: e.target.value })
                }
                className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
                placeholder="กรอกชื่อที่แสดง"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-3 block text-blue-7">รูปภาพ</label>
              <div className="flex flex-nowrap gap-2 overflow-x-scroll">
                {eventAvatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
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
              ชื่อเต็ม ภาษาอังกฤษ
            </label>
            <input
              type="text"
              className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
              onChange={e =>
                setPayload({ ...payload, title_en: e.target.value })
              }
              value={payload?.title_en || ''}
              placeholder="กรอกชื่อเต็ม ภาษาอังกฤษ"
            />
          </div>
          <div>
            <label className="mb-3 block text-blue-7">ชื่อเต็ม ภาษาไทย</label>
            <input
              type="text"
              className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
              onChange={e =>
                setPayload({ ...payload, title_th: e.target.value })
              }
              value={payload?.title_th || ''}
              placeholder="กรอกชื่อเต็ม ภาษาไทย"
            />
          </div>
          <div>
            <label className="mb-3 block text-blue-7">คำอธิบาย</label>
            <textarea
              value={payload?.description || ''}
              onChange={e =>
                setPayload({ ...payload, description: e.target.value })
              }
              className="h-48 w-full resize-none rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
              placeholder="กรอกคำอธิบาย"
            ></textarea>
          </div>
          <div>
            <label className="mb-3 block text-blue-7">ลิงก์ข่าว</label>
            <input
              type="text"
              className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
              onChange={e =>
                setPayload({ ...payload, news_link: e.target.value })
              }
              value={payload?.news_link || ''}
              placeholder="กรอกลิงก์ข่าว"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">สถานที่</label>
              <input
                type="text"
                className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
                onChange={e =>
                  setPayload({ ...payload, location: e.target.value })
                }
                value={payload?.location || ''}
                placeholder="กรอกสถานที่"
              />
            </div>
            <div className="flex-1">
              <label className="mb-3 block text-blue-7">วันที่จัด</label>
              <div className="relative">
                <span
                  className={`absolute top-1/2 left-2.5 -translate-y-1/2 bg-gray-1 p-1 text-center ${
                    payload.date ? '' : 'text-gray-5'
                  }`}
                >
                  {payload?.date
                    ? convertToThaiDate(payload.date)
                    : 'กรอกวันที่จัด'}
                </span>
                <input
                  type="date"
                  className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 px-2.5 focus:outline-none"
                  onChange={e =>
                    setPayload({ ...payload, date: e.target.value })
                  }
                  value={
                    payload?.date
                      ? payload.date
                      : new Date().toISOString().split('T')[0]
                  }
                />
              </div>
            </div>
            <div className="">
              <label className="mb-3 block text-blue-7">จำนวนผู้เข้าร่วม</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  className="h-8.75 w-17.5 rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
                  placeholder="กรอกจำนวนผู้เข้าร่วม"
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
              <label className="mb-3 block text-blue-7">กลุ่มเป้าหมาย</label>
              <input
                type="text"
                className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 p-2.5 focus:outline-none"
                placeholder="กรอกกลุ่มเป้าหมาย"
                onChange={e =>
                  setPayload({ ...payload, target_group: e.target.value })
                }
                value={payload?.target_group || ''}
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
      </div>
    </div>
  );
}
