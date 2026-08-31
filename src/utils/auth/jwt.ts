export function getUserIdFromJwt(token?: string): number | undefined {
  if (!token) return undefined;

  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return undefined;

    const payload = JSON.parse(
      Buffer.from(payloadPart, 'base64').toString('utf-8'),
    ) as {
      data?: { user?: { id?: number | string } };
      user_id?: number | string;
      id?: number | string;
      sub?: number | string;
    };

    const raw =
      payload?.data?.user?.id ?? payload?.user_id ?? payload?.id ?? payload?.sub;
    const id = Number(raw);

    return Number.isFinite(id) && id > 0 ? id : undefined;
  } catch {
    return undefined;
  }
}
