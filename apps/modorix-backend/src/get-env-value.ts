export function getEnvValue(envValueKey: string): string {
  const envValue = process.env[envValueKey];
  if (envValue) {
    return envValue;
  }
  throw new Error(`${envValueKey} env value is missing`);
}
