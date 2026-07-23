export function LookSpin() {
  return (
    <div className="lookspin">
      {Array.from({ length: 8 }, (_, indx) => (
        <div key={indx} className="spoke" style={{ "--i": indx }} />
      ))}
    </div>
  );
}
