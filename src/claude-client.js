// Defines the optional Claude browser client.
// If no host injects window.AMANAT_API_KEY, API calls fail and the existing
// Companion/Reframe try/catch paths fall back to local safety logic.
window.claude = {
  async complete({ system, messages }) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': window.AMANAT_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system,
        messages,
      }),
    });
    if (!response.ok) throw new Error('API error ' + response.status);
    const data = await response.json();
    return data?.content?.[0]?.text || '';
  },
};
