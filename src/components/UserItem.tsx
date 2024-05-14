import defaultLogo from "../assets/citu_logo.png";

export default function UserItem({ name, ...props }) {
  return (
    <div {...props} className="flex items-center gap-4 my-7">
      <img
        src={defaultLogo}
        className="md:w-14 md:h-14 s:w-12 s:h-12 xs:w-10 xs:h-10"
      />
      <p className="text-neutral-600 md:text-base s:text-sm xs:text-sm">
        {name}
      </p>
    </div>
  );
}
