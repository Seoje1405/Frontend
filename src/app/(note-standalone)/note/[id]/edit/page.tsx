import { getMedicationForEdit } from '@/lib/data/note';
import { notFound } from 'next/navigation';
import { MedicationEditForm } from './_components/medication-edit-form';

type Params = Promise<{ id: string }>;

export default async function MedicationEditPage({ params }: { params: Params }) {
  const { id } = await params;
  const medicationId = Number(id);
  if (!Number.isInteger(medicationId)) notFound();

  const initialValues = await getMedicationForEdit(medicationId);
  if (!initialValues) notFound();

  return <MedicationEditForm medicationId={medicationId} initialValues={initialValues} />;
}
