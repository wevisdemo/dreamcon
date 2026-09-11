interface Props {
  heroTitle: string;
  navigateLink?: string;
  textNavigate?: string;
}
export default function Hero(props: Props) {
  return (
    <div className="flex flex-col gap-0 md:gap-4">
      <div className="flex justify-between">
        <img src="/icon/cloud-1.svg" alt="cloud-1" />
        <img src="/icon/cloud-2.svg" alt="cloud-2" />
        <img
          src="/icon/cloud-3.svg"
          alt="cloud-3"
          className="md:block hidden"
        />
      </div>
      <div className="flex flex-col gap-3.5">
        {props.navigateLink && (
          <a
            href={props.navigateLink}
            className="wv-ibmplex wv-bold text-blue-7 underline "
          >
            {props.textNavigate}
          </a>
        )}
        <h2 className="wv-ibmplex wv-bold heading-2">{props.heroTitle}</h2>
      </div>
      <div className="flex justify-between">
        <img src="/icon/cloud-4.svg" alt="cloud-4" />
        <img src="/icon/cloud-5.svg" alt="cloud-5" />
        <img
          src="/icon/cloud-6.svg"
          alt="cloud-6"
          className="md:block hidden"
        />
      </div>
    </div>
  );
}
