import MediCard from './components/medi-card';

export default function MediCardPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center">
      <main className="bg-surface my-4 w-full max-w-[393px] flex-1">
        <MediCard />
      </main>
    </div>
  );
}
