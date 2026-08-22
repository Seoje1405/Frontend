import { NoteMedItem } from '@/components/note-med-item';
import type { NoteHospitalGroup } from '@/lib/data/types';
import { Building2 } from 'lucide-react';
import { NoteReregisterButton } from './note-reregister-button';

interface NoteHospitalCardProps {
  group: NoteHospitalGroup;
}

export function NoteHospitalCard({ group }: NoteHospitalCardProps) {
  return (
    <div className="shadow-card bg-card rounded-xl p-4">
      {/* 병원 헤더 — 수정/삭제는 medicationId 단건 API라 개별 약 행(NoteMedItem)으로 이동 */}
      <div className="flex items-center gap-2">
        <Building2 size={16} className="text-ink-500 shrink-0" aria-hidden />
        <h3 className="text-foreground truncate text-sm font-semibold">
          {group.hospitalName ?? '병원 정보 없음'}
        </h3>
      </div>

      {/* 약물 목록 */}
      <ul role="list" className="divide-line mt-3 divide-y">
        {group.medications.map((med) => (
          <li key={med.id}>
            <NoteMedItem medication={med} />
          </li>
        ))}
      </ul>

      {/* 재등록 버튼 */}
      {group.showReregistration && (
        <NoteReregisterButton
          hospitalName={group.hospitalName}
          medicationIds={group.medications.map((med) => med.id)}
        />
      )}
    </div>
  );
}
