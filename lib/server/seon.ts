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
// Fail-open: якщо ключ не налаштований або SEON недоступний/таймаут — дозволяємо.
// Блокуємо тільки за явним вердиктом state === 'DECLINE'.
export async function evaluateRegistration(input: EvaluateInput): Promise<FraudVerdict> {
  const apiKey = process.env.SEON_LICENSE_KEY;
  if (!apiKey) return { allow: true };

  const body: Record<string, unknown> = {
    action_type: 'account_register',
    merchant_id: process.env.SEON_MERCHANT_ID ?? 'frontstore_reg',
  };
  if (input.email) body.email = input.email;
  if (input.ip) body.ip = input.ip;
  if (input.session) body.session = input.session;

  try {
    const { data } = await axios.post(SEON_FRAUD_API, body, {
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      timeout: 4000,
    });

    const result = (data?.data ?? {}) as { state?: string; fraud_score?: number };
    return {
      allow: result.state !== 'DECLINE',
      state: result.state,
      fraudScore: result.fraud_score,
    };
  } catch {
    return { allow: true };
  }
}
