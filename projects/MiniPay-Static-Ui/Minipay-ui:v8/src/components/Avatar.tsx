export function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-display font-semibold text-background"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}
