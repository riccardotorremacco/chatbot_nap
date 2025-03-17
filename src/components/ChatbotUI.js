import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Home, BarChart2, User, Calendar, Zap, Bell, 
  Paperclip, Mic, Send, CheckCircle, MessageSquare, Menu,
  Plus, FileText, CreditCard, Users, Landmark, ThumbsUp, ThumbsDown, Copy
} from 'lucide-react';
import './ChatbotUI.css';

// URL del backend API
const API_URL = 'http://localhost:8000/api';

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ciao, sono l\'assistente virtuale del Comune di Napoli. Come posso aiutarti oggi?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const messagesEndRef = useRef(null);

  // Verifica la connessione all'API all'avvio
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        setIsConnected(data.status === 'healthy');
      } catch (error) {
        console.error('Errore di connessione al server:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessageToAPI = async (userMessage) => {
    try {
      // Prepara i messaggi nel formato richiesto dall'API
      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }));
      
      // Aggiungi il messaggio dell'utente corrente
      apiMessages.push({
        role: 'user',
        content: userMessage
      });

      // Invia la richiesta all'API
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        throw new Error('Errore nella risposta del server');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Errore nella chiamata API:', error);
      return 'Mi dispiace, si è verificato un errore nella comunicazione con il server. Riprova più tardi.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Aggiungi messaggio utente
    const userMessage = inputText;
    const newMessages = [...messages, { sender: 'user', text: userMessage, timestamp: new Date() }];
    setMessages(newMessages);
    setInputText('');

    // Mostra indicatore di digitazione
    setIsTyping(true);

    // Invia messaggio all'API e attendi risposta
    const botResponse = await sendMessageToAPI(userMessage);
    
    // Nascondi indicatore di digitazione e aggiungi risposta del bot
    setIsTyping(false);
    setMessages([...newMessages, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
  };

  const sendQuickAction = async (action) => {
    // Implementa l'invio di un messaggio rapido predefinito
    const quickMessage = action;
    const newMessages = [...messages, { sender: 'user', text: quickMessage, timestamp: new Date() }];
    setMessages(newMessages);

    // Mostra indicatore di digitazione
    setIsTyping(true);

    // Invia messaggio all'API e attendi risposta
    const botResponse = await sendMessageToAPI(quickMessage);
    
    // Nascondi indicatore di digitazione e aggiungi risposta del bot
    setIsTyping(false);
    setMessages([...newMessages, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
  };

  // Funzione per copiare il testo del messaggio
  const copyMessageText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Mostra un feedback temporaneo
        alert('Testo copiato negli appunti!');
      })
      .catch(err => {
        console.error('Errore nella copia del testo: ', err);
      });
  };

  // Auto-scroll ai messaggi più recenti
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="napl-container">
      {/* Banner superiore */}
      <div className="napl-banner">
        <img src="/assets/napoli-logo.png" alt="Logo Comune di Napoli" className="napl-banner-logo" />
        <div className="napl-banner-text">
          <h2>Comune di Napoli</h2>
          <p>Innovazione al servizio del cittadino</p>
        </div>
      </div>

      {/* Header */}
      <div className="napl-header">
        <div className="napl-header-left">
          <Landmark size={24} className="napl-logo-icon" />
          <div className="napl-header-title-container">
            <h1 className="napl-header-title">Assistente Digitale del Comune</h1>
            <p className="napl-header-subtitle">Napoli: Innovazione e Tradizione</p>
          </div>
        </div>
        <div className="napl-header-actions">
          {/* Pulsante Nuova Chat */}
          <button 
            className="napl-action-button"
            onClick={() => {
              setMessages([{ sender: 'bot', text: 'Ciao, sono l\'assistente virtuale del Comune di Napoli. Come posso aiutarti oggi?', timestamp: new Date() }]);
              setInputText('');
            }}
            title="Nuova Chat"
          >
            <Plus size={18} />
            <span>Nuova Chat</span>
          </button>

          {/* Pulsante Vai al Sito del Comune */}
          <button 
            className="napl-action-button"
            onClick={() => window.open('https://www.comune.napoli.it/home', '_blank')}
            title="Vai al Sito del Comune"
          >
            <Home size={18} />
            <span>Sito Ufficiale</span>
          </button>

          <div className="napl-theme-toggle">
            <div className="napl-theme-option napl-theme-light" title="Tema Chiaro"></div>
            <div className="napl-theme-option napl-theme-dark" title="Tema Scuro"></div>
          </div>
          <Settings size={20} className="napl-settings-icon" />
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
            <BarChart2 size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Calendar size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Zap size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Bell size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Menu size={20} />
          </div>
        </div>

        {/* Area centrale */}
        <div className="napl-content-wrapper">
          <div className="napl-content">
            {/* Icone superiori */}
            <div className="napl-top-icons">
              <button className="napl-top-icon-button">
                <BarChart2 size={20} />
              </button>
              <button className="napl-top-icon-button">
                <User size={20} />
              </button>
              <button className="napl-top-icon-button">
                <Calendar size={20} />
              </button>
              <button className="napl-top-icon-button">
                <Zap size={20} />
              </button>
              <button className="napl-top-icon-button">
                <Bell size={20} />
              </button>
            </div>

            {/* Status del servizio */}
            <div className="napl-service-status">
              <div className="napl-status-icon">
                <CheckCircle size={18} color={isConnected ? "#4CAF50" : "#F44336"} />
              </div>
              <div className="napl-status-text">
                {isConnected 
                  ? "Tutti i servizi sono operativi. Richieste elaborate in tempo reale." 
                  : "Alcuni servizi potrebbero non essere disponibili. La connessione all'API è offline."}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="napl-quick-actions">
              <button className="napl-quick-button" onClick={() => sendQuickAction("Informazioni CIE")}>
                <FileText size={16} />
                <span>Carta d'identità</span>
              </button>
              <button className="napl-quick-button" onClick={() => sendQuickAction("Info demografiche")}>
                <Users size={16} />
                <span>Demografiche</span>
              </button>
              <button className="napl-quick-button" onClick={() => sendQuickAction("Ricevute PagoPA")}>
                <CreditCard size={16} />
                <span>PagoPA</span>
              </button>
              <button className="napl-quick-button" onClick={() => sendQuickAction("Servizi digitali")}>
                <Zap size={16} />
                <span>Servizi online</span>
              </button>
            </div>
            
            {/* Messaggi */}
            <div className="napl-messages">
              {messages.map((message, index) => (
                <div key={index} className={`napl-message ${message.sender}`}>
                  <div className="napl-message-header">
                    <div className="napl-sender-icon">
                      {message.sender === 'bot' ? 'N' : 'U'}
                    </div>
                    <div className="napl-message-sender">
                      {message.sender === 'bot' ? 'NAPL' : 'Utente'}
                    </div>
                    <div className="napl-message-time">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="napl-message-text">
                    {message.text}
                  </div>
                  {message.sender === 'bot' && (
                    <div className="napl-message-actions">
                      <button className="napl-message-action-button" onClick={() => copyMessageText(message.text)}>
                        <Copy size={14} />
                      </button>
                      <button className="napl-message-action-button" onClick={() => setShowFeedback(index)}>
                        <ThumbsUp size={14} />
                      </button>
                      <button className="napl-message-action-button" onClick={() => setShowFeedback(index)}>
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
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
              <button type="button" className="napl-button" aria-label="Allega file">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Chiedi a Napl"
                className="napl-input"
                aria-label="Messaggio"
              />
              <button type="button" className="napl-button" aria-label="Registra audio">
                <Mic size={20} />
              </button>
              <button type="submit" className="napl-send-button" disabled={isTyping} aria-label="Invia messaggio">
                <Send size={18} />
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="napl-footer">
            NAPL - Assistente Digitale del Comune di Napoli - © 2025 Municipality Service System - Versione 1.0.5
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;