
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: '' }]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Você é um assistente em português.' },
          { role: 'user', content: input }
        ]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let assistantMsg = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      const matches = chunk.match(/"delta":\s*\{\s*"content":\s*"([^"]*)"/g);
      if (matches) {
        matches.forEach(match => {
          const content = match.match(/"content":"([^"]*)"/)[1];
          assistantMsg += content;
          setMessages(current => current.map(m => m.role === 'assistant' ? { ...m, content: assistantMsg } : m));
        });
      }
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#4fd1c5' : '#e2e8f0',
            color: msg.role === 'user' ? 'white' : 'black',
            padding: '10px 15px',
            borderRadius: 12,
            margin: '5px 0',
            whiteSpace: 'pre-wrap',
            maxWidth: '60%'
          }}>{msg.content}</div>
        ))}
      </div>
      <div style={{ display: 'flex', padding: 10, background: '#fff' }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
        <button onClick={sendMessage} style={{ marginLeft: 10, padding: '10px 20px', borderRadius: 8, background: '#4fd1c5', color: 'white' }}>Enviar</button>
      </div>
    </div>
  );
}
