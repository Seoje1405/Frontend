import MedicationBottomSheet from './components/medication-bottom-sheet';

export default function MedicationAddPage() {
  return (
    <div className="z-modal bg-card shadow-raised animate-in slide-in-from-bottom fade-in fixed bottom-0 w-full rounded-t-2xl duration-300 ease-out">
      <MedicationBottomSheet />
    </div>
  );
}
