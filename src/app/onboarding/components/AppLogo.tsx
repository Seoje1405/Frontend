import { Phone, Plus } from 'lucide-react';

export function AppLogo() {
  return (
    <div
      className="bg-card shadow-card relative mx-auto mt-4.5 grid size-27 place-items-center rounded-3xl"
      aria-hidden="true"
    >
      <div className="bg-primary grid size-17.5 place-items-center rounded-full">
        <Plus className="text-primary-foreground size-8.5" strokeWidth={2.6} aria-hidden="true" />
      </div>
      <span className="bg-card border-line absolute right-3.5 bottom-3.5 grid size-7.5 place-items-center rounded-full border">
        <Phone className="text-primary size-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
    </div>
  );
}
