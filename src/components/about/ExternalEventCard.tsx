import { ExternalEvent } from '../../types/about';

interface PropsType {
  event: ExternalEvent;
}
export default function ExternalEventCard(props: PropsType) {
  return (
    <div className="w-full max-w-68 p-4 flex flex-col justify-between gap-4 bg-white rounded-lg shadow-md">
      <img
        src={props.event.image_url}
        alt={`event-thumbnail-${props.event.display_name}`}
      />
      <div>
        <h5 className="heading-5 wv-ibmplex font-bold">
          {props.event.display_name}
        </h5>
        <p className="mt-2 text-gray-7">{props.event.description}</p>
      </div>
      <a
        href={props.event.link_url}
        target="_blank"
        className="flex items-center gap-2 text-blue-5 hover:underline"
      >
        <span>เยี่ยมชมงาน</span>
        <img src="/icon/new-tab.svg" alt="icon-new-tab" />
      </a>
    </div>
  );
}
