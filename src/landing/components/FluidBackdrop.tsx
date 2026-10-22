/**
 * Decorative M3 Expressive "fluid shape" field: two organic blobs that morph
 * their border-radius and drift, plus a masked hairline grid. Purely visual —
 * hidden from assistive tech and never interactive.
 */
export function FluidBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="fluid-blob fluid-blob--primary -left-[18%] -top-[46%] h-[560px] w-[560px] opacity-30" />
      <div className="fluid-blob fluid-blob--tertiary -right-[14%] top-[4%] h-[500px] w-[500px] opacity-20" />
      <div className="hairline-grid absolute inset-0 opacity-35" />
    </div>
  );
}
