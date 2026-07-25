export function TokenIcon({
  color,
  icon,
  size = 40,
}: {
  color: string;
  icon: string;
  size?: number;
}) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-display font-bold text-background"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        fontSize: size * 0.42,
      }}
    >
      {icon}
    </div>
  );
}
