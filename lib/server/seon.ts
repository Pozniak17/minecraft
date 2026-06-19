import axios from 'axios';

// SEON Fraud API (EU transaction processing environment).
const SEON_FRAUD_API = 'https://api.seon.io/SeonRestService/fraud-api/v2.0';

export type FraudVerdict = {
  allow: boolean;
  state?: string;
  fraudScore?: number;
};

type EvaluateInput = {
  email?: string;
  ip?: string | null;
  session?: string | null;
};

// Антифрод-перевірка на етапі реєстрації.
// MONITOR-ONLY: SEON збирає дані й рахує score (видно в дашборді), але НІКОГО
// не блокує — реєстрацію пропускаємо завжди. Рішення про блок приймає суппорт
// вручну на основі вердикту в дашборді SEON.
export async function evaluateRegistration(input: EvaluateInput): Promise<FraudVerdict> {
  const apiKey = process.env.SEON_LICENSE_KEY;
  if (!apiKey) return { allow: true };

  // config-прапорці ОБОВ'ЯЗКОВІ, щоб SEON запустив відповідні модулі збагачення.
  // Без них device_details/email_details/ip_details приходять null.
  const config: Record<string, unknown> = { device_fingerprinting: true };
  if (input.email) config.email_api = true;
  if (input.ip) config.ip_api = true;

  const body: Record<string, unknown> = {
    action_type: 'account_register',
    merchant_id: process.env.SEON_MERCHANT_ID ?? 'frontstore_reg',
    config,
  };
  if (input.email) body.email = input.email;
  if (input.ip) body.ip = input.ip;
  if (input.session) body.session = input.session;

  const sessionLen = input.session ? input.session.length : 0;

  try {
    const { data } = await axios.post(SEON_FRAUD_API, body, {
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      // Enrichment-модулі (email/ip/device) збільшують час відповіді — 4с замало.
      // Запас над спостереженими ~11с; fail-open лишається, якщо SEON ще повільніший.
      timeout: 15000,
    });

    const result = (data?.data ?? {}) as {
      id?: number;
      state?: string;
      fraud_score?: number;
      device_details?: unknown;
    };

    // Діагностика: видно у pm2 logs, що реально долетіло в SEON.
    // Якщо device=NULL при наявній session — payload зіпсований/неповний (резолвери недоступні).
    console.log(
      `[seon] register email=${input.email ? 'yes' : 'no'} ip=${input.ip ? 'yes' : 'no'} ` +
        `session=${sessionLen || 'none'} -> seon_id=${result.id ?? '-'} ` +
        `state=${result.state ?? '-'} score=${result.fraud_score ?? '-'} ` +
        `device=${result.device_details ? 'yes' : 'NULL'}`,
    );

    // Monitor-only: завжди allow, блокування лишаємо на ручний розгляд суппорту.
    return {
      allow: true,
      state: result.state,
      fraudScore: result.fraud_score,
    };
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    const message = axios.isAxiosError(err)
      ? JSON.stringify(err.response?.data ?? err.message)
      : String(err);
    console.error(`[seon] error session=${sessionLen || 'none'} status=${status ?? '-'} ${message}`);
    return { allow: true };
  }
}
