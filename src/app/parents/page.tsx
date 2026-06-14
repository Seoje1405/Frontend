import ParentAdd, { type Parent } from './components/parent-add';

async function getParents(): Promise<Parent[]> {
  return [
    { id: '1', name: '홍길동' },
    { id: '2', name: '김철수' },
    { id: '3', name: '박영희' },
  ];
}

export default async function ParentsPage() {
  const parents = await getParents();
  return (
    <div className="p-4">
      <ParentAdd parents={parents} />
    </div>
  );
}
