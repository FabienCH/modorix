export default function ProfileIcon({ email }: { email: string | null }) {
  const text = email
    ? email
        .split('@')[0]
        .split('.')
        .map((name) => name.charAt(0).toUpperCase())
        .join('')
    : '?';

  return <div className="bg-modorix-500 text-white rounded-full px-2	py-1.5 font-semibold tracking-wider">{text}</div>;
}
