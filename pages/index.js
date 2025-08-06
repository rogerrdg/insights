import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    if (!response.ok) {
      console.error('Failed to fetch response');
      return;
    }

    const data = response.body;
    if (!data) return;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let assistantMessage = { role: 'assistant', content: '' };

    setMessages((prev) => [...prev, assistantMessage]);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      assistantMessage.content += chunkValue;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...assistantMessage };
        return updated;
      });
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index} style={{
            backgroundColor: message.role === 'user' ? '#4fd1c5' : '#e2e8f0',
            padding: '10px',
            margin: '10px',
            borderRadius: '10px'
          }}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
