let gatewayBaseUrl: string;

export function setGatewayBaseUrl(baseUrl: string): void {
  gatewayBaseUrl = baseUrl;
}

export function getGatewayBaseUrl(): string {
  if (!gatewayBaseUrl) {
    console.error('Gateway URL error: no url was provided');
  }
  return gatewayBaseUrl;
}
