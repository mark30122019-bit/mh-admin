import { detectAdminEnv, switchAdminEnv, type AdminEnv } from '../env';

const OPTIONS: Array<{ env: AdminEnv; label: string; hint: string }> = [
  { env: 'development', label: 'Тест', hint: 'dev DB' },
  { env: 'production', label: 'Прод', hint: 'production' },
];

/** Neutral brand palette — no orange/terracotta. */
const THEME = {
  track: 'linear-gradient(135deg, #f1f5f9 0%, #e8eef8 100%)',
  trackBorder: '#c9d4e5',
  idleText: '#475569',
  activeProd: 'linear-gradient(135deg, #005BFF 0%, #0046c7 100%)',
  activeDev: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
  activeShadowProd: '0 6px 16px rgba(0, 91, 255, 0.28)',
  activeShadowDev: '0 6px 16px rgba(13, 148, 136, 0.28)',
} as const;

export function EnvSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const current = detectAdminEnv();

  return (
    <div
      role="group"
      aria-label="Окружение базы данных"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 8 : 10,
      }}
    >
      {!compact ? (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#64748b',
          }}
        >
          БД
        </span>
      ) : null}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: 4,
          borderRadius: 999,
          background: THEME.track,
          border: `1px solid ${THEME.trackBorder}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
          minWidth: compact ? 168 : 200,
        }}
      >
        {OPTIONS.map((opt) => {
          const active = opt.env === current;
          const isProd = opt.env === 'production';
          return (
            <button
              key={opt.env}
              type="button"
              aria-pressed={active}
              title={opt.hint}
              onClick={() => {
                if (!active) switchAdminEnv(opt.env);
              }}
              style={{
                appearance: 'none',
                border: 0,
                cursor: active ? 'default' : 'pointer',
                borderRadius: 999,
                padding: compact ? '8px 12px' : '9px 14px',
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.1,
                color: active ? '#fff' : THEME.idleText,
                background: active
                  ? (isProd ? THEME.activeProd : THEME.activeDev)
                  : 'transparent',
                boxShadow: active
                  ? (isProd ? THEME.activeShadowProd : THEME.activeShadowDev)
                  : 'none',
                transition: 'transform 120ms ease, background 120ms ease, color 120ms ease',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
