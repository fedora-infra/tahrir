export function LookSpin() {
  return (
    <div className="lookspin">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="spoke" style={{ "--i": i }} />
      ))}
    </div>
  );
}
