import { DATASET_ZIP_PATH } from '../constants/dataset';
import { Button, ButtonLink } from './button';
import { Modal } from './modal';

const DATA_FILES = [
  ['categories.csv', ': รายชื่อหมวดหมู่และประเด็นย่อย'],
  ['events.csv', ': รายชื่อวงสนทนา'],
  ['topics.csv', ': ข้อถกเถียง'],
  ['comments.csv', ': ความคิดเห็น และความเชื่อมโยงกับข้อถกเถียง'],
];

export function DownloadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="download-modal-title"
      className="gap-5"
    >
      <h2 id="download-modal-title" className="text-h5 font-bold">
        ดาวน์โหลดข้อมูล
      </h2>
      <div className="flex flex-col gap-2.5">
        <p>
          คุณกำลังจะดาวน์โหลดข้อมูลทั้งหมดในเว็บไซต์นี้ในรูปแบบตาราง (ไฟล์ CSV) บรรจุในไฟล์
          .zip ประกอบด้วย:
        </p>
        <ul className="list-disc pl-6">
          {DATA_FILES.map(([name, description]) => (
            <li key={name}>
              <b>{name}</b> {description}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <ButtonLink
          variant="primary-blue"
          href={DATASET_ZIP_PATH}
          download
          onClick={onClose}
        >
          ดาวน์โหลด
        </ButtonLink>
      </div>
    </Modal>
  );
}
