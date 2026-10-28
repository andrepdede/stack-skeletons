import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (event.requestContext.http.method !== 'POST') return { statusCode: 405, body: 'method not allowed' };
  let body: { phone?: string; text?: string };
  try { body = JSON.parse(event.body ?? '{}'); } catch { return { statusCode: 400, body: 'invalid json' }; }
  if (!body.phone || !body.text) return { statusCode: 422, body: 'phone and text are required' };
  // real code: enqueue to SQS, return fast (webhooks must answer within seconds)
  return { statusCode: 202, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ accepted: true }) };
}
