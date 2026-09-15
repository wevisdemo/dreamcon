import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import { ExternalEvent } from '../../types/about';

interface PropsType {
  event: ExternalEvent;
}
export default function ExternalEventCard(props: PropsType) {
  return (
    <div className="flex w-full max-w-68 flex-col justify-between gap-4 rounded-lg bg-white p-4 shadow-md">
      <img
        src={props.event.image_url}
        alt={`event-thumbnail-${props.event.display_name}`}
      />
      <div>
        <h5 className="wv-ibmplex heading-5 font-bold">
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
        <OpenInNewIcon className="h-4 w-4 text-blue-6" aria-hidden />
      </a>
    </div>
  );
}
