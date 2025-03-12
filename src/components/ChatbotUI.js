import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Home, BarChart2, User, Calendar, Zap, Bell, 
  Paperclip, Mic, Send, CheckCircle, MessageSquare, Menu
} from 'lucide-react';
import './ChatbotUI.css';

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ciao Pasquale, inserisci il codice avviso ed il codice fiscale.' },
    { sender: 'user', text: 'Dove trovo il codice di avviso?' },
    { sender: 'bot', text: "Il codice si trova sull'avviso di pagamento ed è composto da 18 cifre." },
    { sender: 'user', text: 'Codice fiscale: PPAHSHBDOSNP839J , Codice di avviso: 193891485701AGJ384' },
    { sender: 'bot', text: 'Ecco la ricevuta che stavi cercando:' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Aggiungi messaggio utente
    const newMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    // Simula risposta bot
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([...newMessages, { 
        sender: 'bot', 
        text: "Sto elaborando la tua richiesta. Per favore attendi mentre verifico le informazioni nel nostro database." 
      }]);
    }, 2000);
  };

  // Auto-scroll ai messaggi più recenti
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="napl-container">
      {/* Header */}
      <div className="napl-header">
        <div className="napl-header-left">
          <Home size={22} />
          <h1 className="napl-header-title">NAPL 1.0</h1>
        </div>
        <div className="napl-header-actions">
          <div className="napl-theme-toggle">
            <div className="napl-theme-option napl-theme-light" title="Tema Chiaro"></div>
            <div className="napl-theme-option napl-theme-dark" title="Tema Scuro"></div>
          </div>
          <Settings size={20} color="#505050" />
          <div className="napl-avatar">P</div>
        </div>
      </div>

      {/* Layout principale */}
      <div className="napl-main">
        {/* Sidebar */}
        <div className="napl-sidebar">
          <div className="napl-sidebar-icon active">
            <User size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <BarChart2 size={20} color="#505050" />
          </div>
          <div className="napl-sidebar-icon">
            <Calendar size={20} color="#505050" />
          </div>
          <div className="napl-sidebar-icon">
            <Zap size={20} color="#505050" />
          </div>
          <div className="napl-sidebar-icon">
            <Bell size={20} color="#505050" />
          </div>
          <div className="napl-sidebar-icon">
            <Menu size={20} color="#505050" />
          </div>
        </div>

        {/* Area centrale */}
        <div className="napl-content-wrapper">
          <div className="napl-content">
            {/* Icone superiori - come nell'immagine */}
            <div className="napl-top-icons">
              <button className="napl-top-icon-button">
                <BarChart2 size={20} color="#505050" />
              </button>
              <button className="napl-top-icon-button">
                <User size={20} color="#505050" />
              </button>
              <button className="napl-top-icon-button">
                <Calendar size={20} color="#505050" />
              </button>
              <button className="napl-top-icon-button">
                <Zap size={20} color="#505050" />
              </button>
              <button className="napl-top-icon-button">
                <Bell size={20} color="#505050" />
              </button>
            </div>

            {/* Status del servizio */}
            <div className="napl-service-status">
              <div className="napl-status-icon">
                <CheckCircle size={18} />
              </div>
              <div className="napl-status-text">
                Tutti i servizi sono operativi. Richieste elaborate in tempo reale.
              </div>
            </div>
            
            {/* Messaggi - stile più simile all'immagine */}
            <div className="napl-messages">
              {messages.map((message, index) => (
                <div key={index} className={`napl-message ${message.sender}`}>
                  <div className="napl-message-header">
                    <div className="napl-sender-icon">
                      {message.sender === 'bot' ? 'N' : 'U'}
                    </div>
                    <div className="napl-message-sender">
                      {message.sender === 'bot' ? 'NAPL' : 'User'}
                    </div>
                  </div>
                  <div className="napl-message-text">
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="napl-message bot">
                  <div className="napl-message-header">
                    <div className="napl-sender-icon">N</div>
                    <div className="napl-message-sender">NAPL</div>
                  </div>
                  <div className="napl-typing">
                    <div className="napl-typing-dot"></div>
                    <div className="napl-typing-dot"></div>
                    <div className="napl-typing-dot"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="napl-input-container">
            <form onSubmit={handleSubmit} className="napl-input-form">
              <button type="button" className="napl-button">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Chiedi a Napl"
                className="napl-input"
              />
              <button type="button" className="napl-button">
                <Mic size={20} />
              </button>
              <button type="submit" className="napl-send-button">
                <Send size={18} />
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="napl-footer">
            NAPL 1.0 - © 2025 Municipality Service System - Versione 1.0.5
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;