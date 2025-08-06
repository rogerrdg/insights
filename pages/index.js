import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Você é um assistente útil.' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      const assistantMessage = { role: 'assistant', content: data.reply };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Erro: Failed to fetch. Tente novamente.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }

    setInput('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh-300px)',
      padding: '20px',
      backgroundColor: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ overflowY: 'auto', marginBottom: '20px' }}>
        {messages
          .filter(msg => msg.role !== 'system')
          .map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{
                backgroundColor: msg.role === 'user' ? '#2ed3b7' : '#f1f1f1',
                color: msg.role === 'user' ? '#fff' : '#333',
                padding: '10px 15px',
                borderRadius: '20px',
                maxWidth: '60%',
                fontSize: '14px'
              }}>
                {msg.content}
              </div>
            </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={{
            flex: 1,
            padding: '12px 15px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            marginRight: '10px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: '#a0f0df',
            border: 'none',
            borderRadius: '12px',
            padding: '10px',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 0-.707 0L.146 15.146a.5.5 0 1 0 .707.707L15.854.853a.5.5 0 0 0 0-.707z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
