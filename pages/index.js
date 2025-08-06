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
    setMessages(updatedMessages);  // Atualiza histórico com a mensagem do usuário

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages })  // Envia histórico completo
    });

    const data = await response.json();
    const assistantMessage = { role: 'assistant', content: data.result };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);  // Adiciona resposta
    setInput('');  // Limpa o input
  };

  return (
    <div style={{ padding: '20px' }}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            background: msg.role === 'user' ? '#4fd1c5' : '#e2e8f0',
            color: '#000',
            padding: '10px',
            marginBottom: '5px',
            borderRadius: '10px',
            maxWidth: '70%',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          {msg.content}
        </div>
      ))}

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, padding: '10px', borderRadius: '5px', marginRight: '10px' }}
        />
        <button onClick={handleSend} style={{ padding: '10px 20px' }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
