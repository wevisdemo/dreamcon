import { ExternalEvent } from '../../types/about';

interface PropsType {
  event: ExternalEvent;
}
export default function ExternalEventCard(props: PropsType) {
  return (
    <div className="w-full max-w-[272px] p-[16px] flex flex-col justify-between gap-[16px] bg-white rounded-[8px] shadow-md">
      <img
        src={props.event.image_url}
        alt={`event-thumbnail-${props.event.display_name}`}
      />
      <div>
        <h5 className="text-xl font-bold">{props.event.display_name}</h5>
        <p className="mt-2 text-gray-600">{props.event.description}</p>
      </div>
      <a
        href={props.event.link_url}
        target="_blank"
        className="flex items-center gap-2 text-blue-500 hover:underline"
      >
        <span>เยี่ยมชมงาน</span>
        <img src="/icon/new-tab.svg" alt="icon-new-tab" />
      </a>
    </div>
  );
}
