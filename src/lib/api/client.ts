import { getAccessToken } from '@/lib/auth/session';

const API_BASE_URL = process.env.API_BASE_URL;

// status: 0은 네트워크 오류(응답 자체를 받지 못한 경우)를 의미
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown; // FormData는 그대로, 그 외 값은 JSON으로 직렬화
  skipAuth?: boolean; // OAuth 로그인 등 아직 accessToken이 없는 요청
}

interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  data: T;
  timestamp: string;
  message?: string;
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  const { body, skipAuth, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const requestHeaders = new Headers(headers);
  if (!isFormData && body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, '서버에 연결할 수 없습니다.');
  }

  const text = await response.text();
  let json: ApiEnvelope<T> | null = null;
  try {
    json = text ? (JSON.parse(text) as ApiEnvelope<T>) : null;
  } catch {
    throw new ApiError(response.status, '서버 응답을 처리할 수 없습니다.');
  }

  if (!response.ok || json?.success === false) {
    throw new ApiError(response.status, json?.message ?? '요청 처리 중 오류가 발생했습니다.');
  }

  return (json?.data ?? null) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
