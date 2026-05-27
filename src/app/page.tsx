export default function Home() {
  return (
    <div className="bg-bg flex min-h-screen flex-col items-center font-sans">
      <main className="bg-surface p-xl flex w-full max-w-[390px] flex-1 flex-col items-center justify-center shadow-sm">
        <div className="mb-xl bg-primary-dim flex h-20 w-20 items-center justify-center rounded-lg">
          <span className="text-primary text-3xl">💊</span>
        </div>

        <h1 className="text-display text-ink-strong">온길 (Ongil)</h1>

        <p className="mt-md text-body text-ink-mid text-center">
          부모님의 건강한 일상을 지키는
          <br />
          스마트 복약 관리 서비스입니다.
        </p>

        <div className="mt-xl w-full">
          <button className="btn-primary w-full">시작하기</button>
        </div>
      </main>
    </div>
  );
}
