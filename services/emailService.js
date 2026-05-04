export async function sendMockEmail({ recipient, subject, body }) {
  const recipientPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!recipientPattern.test(recipient.trim())) {
    throw new Error('Enter a valid recipient email.');
  }

  if (!subject.trim()) {
    throw new Error('Enter a subject.');
  }

  if (!body.trim()) {
    throw new Error('Enter a message.');
  }

  // MVP uses a mock confirmation. A mailto or provider API can be added here
  // without changing the Email screen.
  return {
    ok: true,
    message: 'Email sent (mock)',
  };
}
