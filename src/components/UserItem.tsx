import defaultLogo from "../assets/citu_logo.png";

export default function UserItem({ name, ...props }) {
  return (
    <div {...props} className="flex items-center gap-4 my-7">
      <img src={defaultLogo} className="w-14 h-14" />
      <p className="text-neutral-600">{name}</p>
    </div>
  );
}
