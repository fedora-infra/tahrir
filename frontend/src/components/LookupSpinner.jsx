export function LookupSpinner() {
  return (
    <div className="lookup-spinner">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="spoke" style={{ "--i": i }} />
      ))}
    </div>
  );
}
