export default function Details({ title, text }) {
  return (
    <details open>
      <summary className="hover:cursor-pointer">{title}</summary>
      <code className="text-neutral-600">{text}</code>
    </details>
  );
}
