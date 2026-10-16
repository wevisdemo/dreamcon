import { OpenInNewIcon } from '../../icons/open-in-new';

export type ProjectCardData = {
  name: string;
  description: string;
  href: string;
  image: string;
};

export function ProjectCard({
  name,
  description,
  href,
  image,
}: ProjectCardData) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-90 flex-col justify-between rounded-2xl bg-white p-2.5 hover:bg-blue-2"
    >
      <span className="flex gap-2.5 p-5">
        <span className="flex flex-1 flex-col gap-1">
          <span className="text-h10 font-bold text-blue-7">{name}</span>
          <span className="text-b5">{description}</span>
        </span>
        <OpenInNewIcon className="size-4.5 shrink-0 text-blue-7" />
      </span>
      <img
        src={image}
        alt=""
        loading="lazy"
        className="h-40 w-full rounded-2xl object-cover"
      />
    </a>
  );
}
