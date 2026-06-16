// Клієнтський SEON JavaScript Agent v6.
// Завантажує агент із CDN, вмикає поведінковий аналіз і збирає зашифрований
// device-intelligence session, який далі передається на /api/auth/register.
// Інтеграція fail-open: будь-яка помилка повертає null і не блокує реєстрацію.

const SEON_SRC = 'https://cdn.dfsdk.com/js/v6/agent.umd.js';

type SeonAgent = {
  init: (config?: Record<string, unknown>) => void;
  getSession: (config?: Record<string, unknown>) => Promise<string>;
};

declare global {
  interface Window {
    seon?: SeonAgent;
  }
}

let loadPromise: Promise<SeonAgent | null> | null = null;

function loadAgent(): Promise<SeonAgent | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.seon) return Promise.resolve(window.seon);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise(resolve => {
    const finish = () => resolve(window.seon ?? null);
    const fail = () => resolve(null);

    const existing = document.querySelector<HTMLScriptElement>('script[data-seon]');
    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener('error', fail, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = SEON_SRC;
    script.async = true;
    script.dataset.seon = 'true';
    script.addEventListener('load', finish, { once: true });
    script.addEventListener('error', fail, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}

// Викликати при відкритті форми — стартує збір поведінкових сигналів.
export async function initSeon(): Promise<void> {
  const agent = await loadAgent();
  try {
    agent?.init();
  } catch {
    // антифрод не критичний для UI — мовчки ігноруємо
  }
}

// Викликати при сабміті — повертає session-рядок або null (fail-open).
export async function getSeonSession(): Promise<string | null> {
  const agent = await loadAgent();
  if (!agent) return null;
  try {
    return await agent.getSession({
      geolocation: { canPrompt: false },
      networkTimeoutMs: 2000,
      fieldTimeoutMs: 2000,
      silentMode: true,
    });
  } catch {
    return null;
  }
}
