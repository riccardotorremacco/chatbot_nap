import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Home, BarChart2, User, Calendar, Zap, Bell, 
  Paperclip, Mic, Send, CheckCircle, MessageSquare, Menu,
  Plus, FileText, CreditCard, Users, Landmark, ThumbsUp, ThumbsDown, Copy
  Paperclip, Mic, Send, CheckCircle, MessageSquare, Menu,
  Plus, FileText, CreditCard, Users, Landmark, ThumbsUp, ThumbsDown, Copy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import './ChatbotUI.css';

// URL del backend API
const API_URL = 'http://localhost:8000/api';

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ciao, sono l\'assistente virtuale del Comune di Napoli. Come posso aiutarti oggi?', timestamp: new Date() }
    { sender: 'bot', text: 'Ciao, sono l\'assistente virtuale del Comune di Napoli. Come posso aiutarti oggi?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);
  const messagesEndRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

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

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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

    const userMessage = inputText;
    const newMessages = [...messages, { sender: 'user', text: userMessage, timestamp: new Date() }];
    const newMessages = [...messages, { sender: 'user', text: userMessage, timestamp: new Date() }];
    setMessages(newMessages);
    setInputText('');

    setIsTyping(true); // Imposta isTyping a true prima della chiamata API

    try {
      const botResponse = await sendMessageToAPI(userMessage);
      setIsTyping(false); // Imposta isTyping a false dopo la risposta (o l'errore)
      setMessages([...newMessages, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
    } catch (error) {
      setIsTyping(false); // Assicurati che isTyping sia false anche in caso di errore
      setMessages([...newMessages, { sender: 'bot', text: 'Si è verificato un errore. Riprova più tardi.', timestamp: new Date() }]);
    }
  };

  const sendQuickAction = async (action) => {
    const quickMessage = action;
    const newMessages = [...messages, { sender: 'user', text: quickMessage, timestamp: new Date() }];
    setMessages(newMessages);

    setIsTyping(true); // Imposta isTyping a true prima della chiamata API

    try {
      const botResponse = await sendMessageToAPI(quickMessage);
      setIsTyping(false); // Imposta isTyping a false dopo la risposta (o l'errore)
      setMessages([...newMessages, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
    } catch (error) {
      setIsTyping(false); // Assicurati che isTyping sia false anche in caso di errore
      setMessages([...newMessages, { sender: 'bot', text: 'Si è verificato un errore. Riprova più tardi.', timestamp: new Date() }]);
    }
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
          <Landmark size={17} className="napl-logo-icon" />
          <div className="napl-header-title-container">
            <h1 className="napl-header-title">Assistente Digitale Napoletano</h1>
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
            <div
              className={`napl-theme-option napl-theme-light ${!isDarkMode ? 'active' : ''}`}
              title="Tema Chiaro"
              onClick={() => setIsDarkMode(false)}
            ></div>
            <div
              className={`napl-theme-option napl-theme-dark ${isDarkMode ? 'active' : ''}`}
              title="Tema Scuro"
              onClick={() => setIsDarkMode(true)}
            ></div>
          </div>
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
            <BarChart2 size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Calendar size={20} />
            <Calendar size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Zap size={20} />
            <Zap size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Bell size={20} />
            <Bell size={20} />
          </div>
          <div className="napl-sidebar-icon">
            <Menu size={20} />
            <Menu size={20} />
          </div>
        </div>

        {/* Area contenuto principale */}
        <div className="napl-content-wrapper">
          <div className="napl-content">
            {/* Status del servizio - opzionale basato su isConnected */}
            {!isConnected && (
              <div className="napl-service-status">
              </div>
            )}
            
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
                      {message.sender === 'bot' ? 'NAPL' : 'Utente'}
                    </div>
                    <div className="napl-message-time">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="napl-message-text">
                    {message.sender === 'bot' ? (
                      // Usa ReactMarkdown con i plugin per migliorare il rendering
                      <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {children.length > 50 ? `${children.substring(0, 50)}...` : children}
                          </a>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                    
                    ) : (
                      message.text
                    )}
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
                <div className="napl-message bot napl-loading-container">
                  <div className="napl-typing-indicator">
                    <div className="napl-typing-ball"></div>
                    <div className="napl-typing-ball"></div>
                    <div className="napl-typing-ball"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

                      {/* Quick Actions */}
            <div className="napl-quick-actions">
              <button className="napl-quick-button" onClick={() => sendQuickAction("Che informazioni puoi offrirmi?")}>
                <FileText size={16} />
                <span>come puoi aiutarmi?</span>
              </button>
              <button className="napl-quick-button" onClick={() => sendQuickAction("Potresti darmi i contatti del comune di Napoli?")}>
                <Users size={16} />
                <span>Contatti utili del comune</span>
              </button>
              <button className="napl-quick-button" onClick={() => sendQuickAction("Potresti darmi informazioni sui servizi demografici?")}>
                <CreditCard size={16} />
                <span>Info servizi demografici</span>
              </button>
              <button className="napl-quick-button" onClick={() => sendQuickAction("Vorrei fare una segnalazione, di che informazioni hai bisogno?")}>
                <Zap size={16} />
                <span>Segnalazioni</span>
              </button>
            </div>

          {/* Input area */}
          <div className="napl-input-container">
            <form onSubmit={handleSubmit} className="napl-input-form">
              {/* Pulsante per allegare file */}
              <button type="button" className="napl-button" aria-label="Allega file">
                <Paperclip size={16} />
              </button>

              {/* Campo di input per il messaggio */}
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Scrivi un messaggio..."
                className="napl-input"
                aria-label="Messaggio"
              />

              {/* Pulsante per registrare audio */}
              <button type="button" className="napl-button" aria-label="Registra audio">
                <Mic size={16} />
              </button>

              {/* Pulsante per inviare il messaggio */}
              <button type="submit" className="napl-send-button" disabled={isTyping} aria-label="Invia messaggio">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="napl-footer">
        NAPL - Assistente Digitale del Comune di Napoli - Municipality Service System - Versione 1.0.5
      </div>
    </div>
  );
};

export default ChatbotUI;