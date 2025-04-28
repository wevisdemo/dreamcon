export default function TokenExpiredPage() {
  return (
    <div className="w-screen h-screen bg-blue2 flex flex-col gap-[24px] items-center justify-center text-blue7 text-center">
      <img
        className="h-[45px]"
        src="/logo/dream-con-logo-white.svg"
        alt="dreamcon-logo"
      />
      <h2 className="wv-ibmplex text-[39px] font-bold">Invite Link Expired</h2>
      <p className="text-[20px]">
        This invite link may have expired <br /> You can{" "}
        <span className="font-bold">
          request a new link to continue editing
        </span>
      </p>
      <p>
        or head back to the{" "}
        <a className="!text-blue7 !underline" href="/">
          homepage
        </a>
      </p>
    </div>
  );
}
