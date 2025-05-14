interface StreamInfoProps {
  username: string;
}

export default function StreamInfo({ username }: StreamInfoProps) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">{username}</h2>
      <p className="text-gray-400 text-sm">🔴 Live now</p>
    </div>
  );
}
