export default function SignUpSuccess({ children, email }: { children: React.ReactNode; email: string }) {
  return (
    <>
      <h2 className="main-title mx-auto p-4">Almost done!</h2>
      <p className="text-center">
        We have sent an email to <strong>{email}</strong> to confirm your account creation.
      </p>
      <div className="mx-auto">{children}</div>
    </>
  );
}
