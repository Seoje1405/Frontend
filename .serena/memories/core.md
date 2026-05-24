# 온길(piuda) Frontend — 프로젝트 핵심

## 프로젝트 정체

- 한국 복약 관리 앱 "온길(piuda)"의 Next.js 프론트엔드
- 주 사용자: 부모님 세대 복약을 관리하는 보호자
- 핵심 기능: 한국 의약품 API 조회, 복약 일정, OCR 처방전 인식, 전화 알림

## 소스 맵

```
E:\piudaFront\Frontend\
├── src/
│   └── app/                 # Next.js App Router
│       ├── layout.tsx       # 루트 레이아웃 (Geist 폰트 적용)
│       ├── page.tsx         # 홈 페이지 (현재 보일러플레이트)
│       └── globals.css      # Tailwind v4 @import + CSS 변수
├── next.config.ts           # React Compiler 활성화
├── tsconfig.json            # paths: @/* → ./src/*
├── eslint.config.mjs        # next/core-web-vitals + typescript + prettier
└── .prettierrc              # 코드 포맷 설정
```

## 프로젝트 불변 규칙

- `@/*` 경로 alias는 `./src/*`를 가리킴
- 폰트: Geist Sans (`--font-geist-sans`) / Geist Mono (`--font-geist-mono`)
- CSS 변수: `--background`, `--foreground` (다크모드 자동 지원)
- React Compiler 활성화 → memo/useMemo/useCallback 수동 최적화 불필요

세부 내용: `mem:tech_stack`, `mem:conventions`, `mem:suggested_commands`, `mem:task_completion`
