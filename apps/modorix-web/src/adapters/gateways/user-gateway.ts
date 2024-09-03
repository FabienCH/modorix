const usersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

export async function signUp({
  email,
  password,
  confirmPassword,
}: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<Response> {
  return await fetch(`${usersBaseUrl}/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword }),
  });
}
