import { Plus, User } from 'lucide-react';
import Link from 'next/link';

export type Parent = {
  id: string;
  name: string;
};

type ParentAddProps = {
  parents: Parent[];
};

export default function ParentAdd({ parents }: ParentAddProps) {
  return (
    <section aria-label="부모님 목록">
      <ul className="grid grid-cols-3 gap-6" role="list">
        {parents.map((parent) => (
          <li key={parent.id} className="flex justify-center">
            <Link
              href={`/parents/${parent.id}/edit`}
              aria-label={`${parent.name} 편집`}
              className="focus-visible:ring-primary flex flex-col items-center justify-center gap-4 rounded-xl transition-opacity duration-150 outline-none hover:opacity-80 focus-visible:ring-1 focus-visible:ring-offset-2"
            >
              <div className="border-icon-parent flex h-25 w-25 items-center justify-center rounded-full border">
                <User className="text-icon-parent h-13 w-13" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium">{parent.name}</span>
            </Link>
          </li>
        ))}
        <li className="flex justify-center">
          <Link
            href="/parents/add"
            className="focus-visible:ring-primary flex flex-col items-center justify-center gap-4 rounded-xl transition-opacity duration-150 outline-none hover:opacity-80 focus-visible:ring-1 focus-visible:ring-offset-2"
          >
            <div className="bg-muted flex h-25 w-25 items-center justify-center rounded-full border border-dashed">
              <Plus className="text-ink-400 h-13 w-13" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium">부모님 추가</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
