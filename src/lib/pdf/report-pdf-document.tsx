import { REPORT_METHOD_NOTE } from '@/lib/data/report';
import type {
  DrugInteractionDrug,
  MedColor,
  ReportMedication,
  ReportMedicationStatus,
  ReportSummary,
} from '@/lib/data/types';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import path from 'node:path';
import { PDF_COLORS } from './pdf-colors';

// @react-pdf/renderer(fontkit)는 가변 폰트 서브셋 임베딩을 지원하지 않아
// PDF 전용으로 pretendard 패키지의 정적 굵기별 TTF를 사용한다.
const PRETENDARD_DIR = path.join(
  process.cwd(),
  'node_modules/pretendard/dist/public/static/alternative',
);

Font.register({
  family: 'Pretendard',
  fonts: [
    { src: path.join(PRETENDARD_DIR, 'Pretendard-Regular.ttf'), fontWeight: 400 },
    { src: path.join(PRETENDARD_DIR, 'Pretendard-Bold.ttf'), fontWeight: 700 },
  ],
});

const MED_COLOR_HEX: Record<MedColor, string> = {
  blue: PDF_COLORS.medBlue,
  purple: PDF_COLORS.medPurple,
  orange: PDF_COLORS.medOrange,
};

const SEVERITY_LABEL = {
  danger: { label: '상호작용 주의', fg: PDF_COLORS.danger, bg: PDF_COLORS.dangerBg },
  caution: { label: '함께 복용 시 참고', fg: PDF_COLORS.caution, bg: PDF_COLORS.cautionBg },
} as const;

const STATUS_LABEL: Record<ReportMedicationStatus, { label: string; fg: string; bg: string }> = {
  active: { label: '복용 중', fg: PDF_COLORS.statusActive, bg: PDF_COLORS.statusActiveBg },
  completed: { label: '복용 완료', fg: PDF_COLORS.statusDone, bg: PDF_COLORS.statusDoneBg },
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    backgroundColor: PDF_COLORS.canvas,
    padding: 32,
    fontSize: 10,
    color: PDF_COLORS.deepInk,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: PDF_COLORS.deepInk,
    marginBottom: 16,
  },
  card: {
    backgroundColor: PDF_COLORS.cardWhite,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PDF_COLORS.inkBorder,
  },
  divider: {
    height: 1,
    backgroundColor: PDF_COLORS.inkBorder,
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 8,
    color: PDF_COLORS.inkSubtle,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 10,
    fontWeight: 700,
    color: PDF_COLORS.deepInk,
  },
  // 분석정보 카드
  infoCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoCardLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardBar: {
    width: 3,
    height: 12,
    borderRadius: 1.5,
    backgroundColor: PDF_COLORS.primary,
    marginRight: 6,
  },
  infoCardLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: PDF_COLORS.inkText,
  },
  gradeBadge: {
    fontSize: 8,
    fontWeight: 700,
    color: PDF_COLORS.cardWhite,
    backgroundColor: PDF_COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 10,
  },
  infoGridRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoGridField: {
    flex: 1,
  },
  // 상호작용 섹션
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PDF_COLORS.danger,
    marginRight: 6,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: 700,
    color: PDF_COLORS.deepInk,
  },
  sectionDescription: {
    fontSize: 9,
    color: PDF_COLORS.inkSubtle,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drugColumn: {
    flex: 1,
  },
  drugField: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  drugFieldLabel: {
    width: 44,
    fontSize: 8,
    color: PDF_COLORS.inkSubtle,
  },
  interactionDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: PDF_COLORS.inkBorder,
    marginHorizontal: 12,
  },
  drugFieldValue: {
    flex: 1,
    fontSize: 9,
    fontWeight: 700,
    color: PDF_COLORS.deepInk,
  },
  severityBadge: {
    fontSize: 8,
    fontWeight: 700,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 6,
  },
  description: {
    fontSize: 9,
    color: PDF_COLORS.inkText,
    lineHeight: 1.5,
  },
  // 사용중인 약물 배너
  banner: {
    backgroundColor: PDF_COLORS.cardCurrent,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  bannerText: {
    fontSize: 11,
    fontWeight: 700,
    color: PDF_COLORS.cardCurrentText,
  },
  methodNote: {
    fontSize: 8,
    color: PDF_COLORS.inkSubtle,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  // 약물 카드
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  medName: {
    flex: 1,
    fontSize: 11,
    fontWeight: 700,
    color: PDF_COLORS.deepInk,
  },
  medBadge: {
    fontSize: 8,
    fontWeight: 700,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  medKind: {
    fontSize: 9,
    color: PDF_COLORS.inkSubtle,
    marginLeft: 16,
    marginBottom: 8,
  },
  footnote: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    fontSize: 8,
    color: PDF_COLORS.inkSubtle,
  },
});

function DrugColumn({ drug }: { drug: DrugInteractionDrug }) {
  const fields: { label: string; value: string }[] = [
    { label: '제품종류', value: drug.kind },
    { label: '제품명', value: drug.name },
    { label: '처방기관', value: drug.hospitalName ?? '-' },
    { label: '처방날짜', value: drug.prescriptionDate },
  ];

  return (
    <View style={styles.drugColumn}>
      {fields.map((field) => (
        <View key={field.label} style={styles.drugField}>
          <Text style={styles.drugFieldLabel}>{field.label}</Text>
          <Text style={styles.drugFieldValue}>{field.value}</Text>
        </View>
      ))}
    </View>
  );
}

function MedicationCard({ medication }: { medication: ReportMedication }) {
  const status = STATUS_LABEL[medication.status];
  const { startDate, endDate } = medication.dosagePeriod;

  return (
    <View style={styles.card}>
      <View style={styles.medHeaderRow}>
        <View style={[styles.medDot, { backgroundColor: MED_COLOR_HEX[medication.color] }]} />
        <Text style={styles.medName}>{medication.name}</Text>
        <Text style={[styles.medBadge, { color: status.fg, backgroundColor: status.bg }]}>
          {status.label}
        </Text>
      </View>
      <Text style={styles.medKind}>{medication.kind}</Text>

      <View style={styles.divider} />

      <View style={styles.infoGridRow}>
        <View style={styles.infoGridField}>
          <Text style={styles.fieldLabel}>처방기관</Text>
          <Text style={styles.fieldValue}>{medication.hospitalName ?? '-'}</Text>
        </View>
        <View style={styles.infoGridField}>
          <Text style={styles.fieldLabel}>투약기간</Text>
          <Text style={styles.fieldValue}>
            {startDate} ~ {endDate}
          </Text>
        </View>
      </View>
      <View style={styles.infoGridRow}>
        <View style={styles.infoGridField}>
          <Text style={styles.fieldLabel}>총 투여일수</Text>
          <Text style={styles.fieldValue}>{medication.totalDays}일</Text>
        </View>
      </View>
    </View>
  );
}

interface ReportPdfDocumentProps {
  summary: ReportSummary;
}

export function ReportPdfDocument({ summary }: ReportPdfDocumentProps) {
  const { patient, hospitals, interactions } = summary;
  const medications = hospitals.flatMap((hospital) => hospital.medications);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {patient.patientName}님의 약물안전리포트 · {patient.reportDate}
        </Text>

        {/* 분석정보 카드 */}
        <View style={styles.card}>
          <View style={styles.infoCardHeaderRow}>
            <View style={styles.infoCardLabelGroup}>
              <View style={styles.infoCardBar} />
              <Text style={styles.infoCardLabel}>분석정보</Text>
            </View>
            <Text style={styles.gradeBadge}>{patient.grade}</Text>
          </View>

          <View style={styles.infoGridRow}>
            <View style={styles.infoGridField}>
              <Text style={styles.fieldLabel}>이름</Text>
              <Text style={styles.fieldValue}>{patient.patientName}</Text>
            </View>
            <View style={styles.infoGridField}>
              <Text style={styles.fieldLabel}>리포트 ID</Text>
              <Text style={styles.fieldValue}>{patient.reportId}</Text>
            </View>
          </View>
          <View style={styles.infoGridRow}>
            <View style={styles.infoGridField}>
              <Text style={styles.fieldLabel}>생년월일</Text>
              <Text style={styles.fieldValue}>{patient.birthDate}</Text>
            </View>
            <View style={styles.infoGridField}>
              <Text style={styles.fieldLabel}>현재 나이</Text>
              <Text style={styles.fieldValue}>약 {patient.age}세</Text>
            </View>
          </View>
        </View>

        {/* 약물상호작용 위험 — 위험이 없으면 섹션 자체를 생략 */}
        {interactions.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderDot} />
              <Text style={styles.sectionHeaderText}>약물상호작용 위험</Text>
            </View>
            <Text style={styles.sectionDescription}>
              현재 복용 중인 약물 조합에서 상호작용 위험이 확인되었습니다.
            </Text>

            {interactions.map((pair) => {
              const severity = SEVERITY_LABEL[pair.severity];
              return (
                <View key={pair.id} style={styles.card}>
                  <View style={styles.interactionRow}>
                    <DrugColumn drug={pair.drugA} />
                    <View style={styles.interactionDivider} />
                    <DrugColumn drug={pair.drugB} />
                  </View>
                  <Text
                    style={[
                      styles.severityBadge,
                      { color: severity.fg, backgroundColor: severity.bg },
                    ]}
                  >
                    {severity.label}
                  </Text>
                  <Text style={styles.description}>{pair.description}</Text>
                </View>
              );
            })}
          </>
        )}

        {/* 사용중인 약물 */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>사용중인 약물 {medications.length}건</Text>
        </View>
        <Text style={styles.methodNote}>{REPORT_METHOD_NOTE}</Text>

        {medications.map((medication) => (
          <MedicationCard key={medication.id} medication={medication} />
        ))}

        <Text style={styles.footnote}>리포트 ID {patient.reportId} · 온길(Ongil)에서 생성됨</Text>
      </Page>
    </Document>
  );
}
