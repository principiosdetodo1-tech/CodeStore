/**
 * ═══════════════════════════════════════════════════════════════
 * CHATBOT DE LUJO - Dark Luxury Edition (VERSIÓN CORREGIDA)
 * ═══════════════════════════════════════════════════════════════
 * Diseñado para sitios estáticos en GitHub Pages
 * Integración con Google Gemini AI
 * Persistencia de conversaciones con localStorage
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// 🔐 CONFIGURACIÓN DE LA API
// ═══════════════════════════════════════════════════════════════

const API_KEY = 'AIzaSyDGSzWegNratlCjPCmscrBb-iIlw7wINdg'; // ⚠️ Reemplaza con tu API Key de Google AI Studio
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ═══════════════════════════════════════════════════════════════
// 🎭 CONFIGURACIÓN DEL BOT (PERSONALIDAD Y NORMAS)
// ═══════════════════════════════════════════════════════════════

const SISTEMA_PROMPT = `Eres un asistente de lujo altamente profesional y sofisticado.

PERSONALIDAD:
- Hablas con elegancia y refinamiento
- Eres cortés, atento y servicial
- Mantienes un tono profesional pero cálido
- Respondes de manera concisa y precisa

NORMAS:
- Siempre saludas cordialmente
- Proporcionas respuestas útiles y detalladas
- Si no sabes algo, lo admites con gracia
- Mantienes la conversación fluida y natural

ESTILO:
- Usa un lenguaje sofisticado pero comprensible
- Evita jergas o expresiones demasiado casuales
- Sé empático y comprensivo con las necesidades del usuario`;

// ═══════════════════════════════════════════════════════════════
// 💾 GESTIÓN DE PERSISTENCIA
// ═══════════════════════════════════════════════════════════════

class ChatStorage {
    static STORAGE_KEY = 'luxury_chatbot_history';
    
    static saveMessage(role, content) {
        const history = this.getHistory();
        history.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }
    
    static getHistory() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al leer historial:', error);
            return [];
        }
    }
    
    static clearHistory() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
    
    static getConversationContext() {
        const history = this.getHistory();
        // Limitar a los últimos 10 mensajes para no exceder límites
        const recentHistory = history.slice(-10);
        
        return recentHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎨 INYECCIÓN DE ESTILOS CSS
// ═══════════════════════════════════════════════════════════════

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* ═══════════════════════════════════════════════════════════ */
        /* CHATBOT STYLES - Dark Luxury Edition                         */
        /* ═══════════════════════════════════════════════════════════ */
        
        :root {
            --luxury-gold: #D4AF37;
            --luxury-black: #1A1A1A;
            --luxury-dark: #0D0D0D;
            --luxury-gray: #2A2A2A;
            --luxury-light: #F5F5F5;
            --luxury-shadow: rgba(212, 175, 55, 0.3);
            --luxury-glass: rgba(26, 26, 26, 0.85);
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Botón Flotante                                               */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-chat-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 65px;
            height: 65px;
            background: linear-gradient(135deg, var(--luxury-gold) 0%, #B8960D 100%);
            border: 2px solid var(--luxury-gold);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 
                0 8px 25px rgba(0, 0, 0, 0.4),
                0 0 40px var(--luxury-shadow),
                inset 0 2px 5px rgba(255, 255, 255, 0.2);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .luxury-chat-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
            transition: opacity 0.3s ease;
            opacity: 0;
        }
        
        .luxury-chat-button:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 
                0 12px 35px rgba(0, 0, 0, 0.5),
                0 0 60px var(--luxury-shadow),
                inset 0 2px 8px rgba(255, 255, 255, 0.3);
        }
        
        .luxury-chat-button:hover::before {
            opacity: 1;
        }
        
        .luxury-chat-button svg {
            width: 32px;
            height: 32px;
            fill: var(--luxury-black);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            transition: transform 0.3s ease;
        }
        
        .luxury-chat-button:hover svg {
            transform: scale(1.1);
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Ventana de Chat - Glassmorphism                              */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-chat-window {
            position: fixed;
            bottom: 110px;
            right: 30px;
            width: 420px;
            height: 600px;
            background: var(--luxury-glass);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.6),
                0 0 1px rgba(212, 175, 55, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            z-index: 9999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .luxury-chat-window.open {
            display: flex;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Header del Chat                                              */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-chat-header {
            background: linear-gradient(135deg, var(--luxury-dark) 0%, var(--luxury-black) 100%);
            padding: 20px 25px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
        }
        
        .luxury-chat-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--luxury-gold), transparent);
            opacity: 0.3;
        }
        
        .luxury-chat-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .luxury-chat-avatar {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, var(--luxury-gold) 0%, #B8960D 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px var(--luxury-shadow);
            border: 2px solid rgba(212, 175, 55, 0.3);
        }
        
        .luxury-chat-avatar::before {
            content: '✦';
            color: var(--luxury-black);
            font-size: 20px;
            font-weight: bold;
        }
        
        .luxury-chat-info h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--luxury-gold);
            letter-spacing: 0.5px;
            text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
        }
        
        .luxury-chat-info p {
            margin: 2px 0 0 0;
            font-size: 12px;
            color: rgba(245, 245, 245, 0.6);
            letter-spacing: 0.3px;
        }
        
        .luxury-chat-controls {
            display: flex;
            gap: 10px;
        }
        
        .luxury-chat-btn {
            background: transparent;
            border: 1px solid rgba(212, 175, 55, 0.3);
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: rgba(245, 245, 245, 0.7);
        }
        
        .luxury-chat-btn:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--luxury-gold);
            color: var(--luxury-gold);
            transform: scale(1.1);
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Cuerpo del Chat                                              */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-chat-body {
            flex: 1;
            overflow-y: auto;
            padding: 25px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: 
                radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
        }
        
        .luxury-chat-body::-webkit-scrollbar {
            width: 6px;
        }
        
        .luxury-chat-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        .luxury-chat-body::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--luxury-gold), #B8960D);
            border-radius: 10px;
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Burbujas de Mensaje - Diseño Asimétrico                      */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-message {
            display: flex;
            gap: 12px;
            animation: messageSlide 0.3s ease;
        }
        
        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .luxury-message.user {
            flex-direction: row-reverse;
        }
        
        .luxury-message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .luxury-message.user .luxury-message-avatar {
            background: linear-gradient(135deg, var(--luxury-gold) 0%, #B8960D 100%);
            border: 2px solid rgba(212, 175, 55, 0.3);
        }
        
        .luxury-message.bot .luxury-message-avatar {
            background: linear-gradient(135deg, var(--luxury-gray) 0%, var(--luxury-black) 100%);
            border: 2px solid rgba(212, 175, 55, 0.2);
        }
        
        .luxury-message-content {
            max-width: 75%;
            padding: 14px 18px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            word-wrap: break-word;
        }
        
        .luxury-message.user .luxury-message-content {
            background: linear-gradient(135deg, var(--luxury-gold) 0%, #B8960D 100%);
            color: var(--luxury-black);
            border-bottom-right-radius: 4px;
            box-shadow: 
                0 4px 15px rgba(212, 175, 55, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            font-weight: 500;
        }
        
        .luxury-message.bot .luxury-message-content {
            background: rgba(42, 42, 42, 0.6);
            backdrop-filter: blur(10px);
            color: var(--luxury-light);
            border: 1px solid rgba(212, 175, 55, 0.15);
            border-bottom-left-radius: 4px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Indicador de Escritura                                       */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-typing-indicator {
            display: flex;
            gap: 12px;
            padding: 20px 0;
        }
        
        .luxury-typing-indicator .luxury-message-avatar {
            background: linear-gradient(135deg, var(--luxury-gray) 0%, var(--luxury-black) 100%);
            border: 2px solid rgba(212, 175, 55, 0.2);
        }
        
        .luxury-typing-dots {
            background: rgba(42, 42, 42, 0.6);
            backdrop-filter: blur(10px);
            padding: 14px 20px;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(212, 175, 55, 0.15);
            display: flex;
            gap: 6px;
            align-items: center;
        }
        
        .luxury-typing-dots span {
            width: 8px;
            height: 8px;
            background: var(--luxury-gold);
            border-radius: 50%;
            animation: typingBounce 1.4s infinite ease-in-out;
            box-shadow: 0 0 10px var(--luxury-shadow);
        }
        
        .luxury-typing-dots span:nth-child(1) { animation-delay: 0s; }
        .luxury-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .luxury-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
            30% { transform: translateY(-10px); opacity: 1; }
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Footer del Chat (Input)                                      */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-chat-footer {
            padding: 20px 25px;
            background: linear-gradient(180deg, transparent 0%, rgba(13, 13, 13, 0.8) 100%);
            border-top: 1px solid rgba(212, 175, 55, 0.2);
            backdrop-filter: blur(10px);
            position: relative;
        }
        
        .luxury-chat-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--luxury-gold), transparent);
            opacity: 0.3;
        }
        
        .luxury-chat-input-wrapper {
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }
        
        .luxury-chat-input {
            flex: 1;
            background: rgba(42, 42, 42, 0.5);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            color: var(--luxury-light);
            font-size: 14px;
            font-family: inherit;
            resize: none;
            max-height: 120px;
            transition: all 0.3s ease;
            outline: none;
        }
        
        .luxury-chat-input:focus {
            border-color: var(--luxury-gold);
            background: rgba(42, 42, 42, 0.7);
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }
        
        .luxury-chat-input::placeholder {
            color: rgba(245, 245, 245, 0.4);
        }
        
        .luxury-send-btn {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--luxury-gold) 0%, #B8960D 100%);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            flex-shrink: 0;
        }
        
        .luxury-send-btn:hover:not(:disabled) {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(212, 175, 55, 0.5);
        }
        
        .luxury-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .luxury-send-btn svg {
            width: 20px;
            height: 20px;
            fill: var(--luxury-black);
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Mensaje de Bienvenida                                        */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-welcome-message {
            text-align: center;
            padding: 30px 20px;
            color: rgba(245, 245, 245, 0.6);
        }
        
        .luxury-welcome-message .luxury-welcome-icon {
            font-size: 48px;
            margin-bottom: 15px;
            filter: drop-shadow(0 4px 15px var(--luxury-shadow));
        }
        
        .luxury-welcome-message h4 {
            margin: 0 0 8px 0;
            color: var(--luxury-gold);
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .luxury-welcome-message p {
            margin: 0;
            font-size: 13px;
            line-height: 1.6;
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Mensaje de Error                                             */
        /* ─────────────────────────────────────────────────────────── */
        
        .luxury-error-message {
            background: rgba(220, 38, 38, 0.1);
            border: 1px solid rgba(220, 38, 38, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            color: #FCA5A5;
            font-size: 13px;
            line-height: 1.5;
            margin: 10px 0;
        }
        
        /* ─────────────────────────────────────────────────────────── */
        /* Responsive Design                                            */
        /* ─────────────────────────────────────────────────────────── */
        
        @media (max-width: 480px) {
            .luxury-chat-window {
                bottom: 100px;
                right: 15px;
                left: 15px;
                width: auto;
                height: 500px;
            }
            
            .luxury-chat-button {
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
            }
            
            .luxury-message-content {
                max-width: 85%;
            }
        }
    `;
    document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════
// 🏗️ CONSTRUCCIÓN DEL HTML
// ═══════════════════════════════════════════════════════════════

function createChatInterface() {
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = `
        <!-- Botón Flotante -->
        <button class="luxury-chat-button" id="luxuryChatToggle" aria-label="Abrir chat">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        </button>

        <!-- Ventana de Chat -->
        <div class="luxury-chat-window" id="luxuryChatWindow">
            <!-- Header -->
            <div class="luxury-chat-header">
                <div class="luxury-chat-title">
                    <div class="luxury-chat-avatar"></div>
                    <div class="luxury-chat-info">
                        <h3>Asistente de Lujo</h3>
                        <p>Siempre disponible para ti</p>
                    </div>
                </div>
                <div class="luxury-chat-controls">
                    <button class="luxury-chat-btn" id="luxuryClearChat" aria-label="Limpiar conversación" title="Limpiar conversación">
                        🗑️
                    </button>
                    <button class="luxury-chat-btn" id="luxuryCloseChat" aria-label="Cerrar chat" title="Cerrar chat">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Cuerpo del Chat -->
            <div class="luxury-chat-body" id="luxuryChatBody">
                <div class="luxury-welcome-message">
                    <div class="luxury-welcome-icon">✦</div>
                    <h4>Bienvenido</h4>
                    <p>¿En qué puedo asistirle hoy?</p>
                </div>
            </div>

            <!-- Footer (Input) -->
            <div class="luxury-chat-footer">
                <div class="luxury-chat-input-wrapper">
                    <textarea 
                        class="luxury-chat-input" 
                        id="luxuryChatInput" 
                        placeholder="Escribe tu mensaje..."
                        rows="1"
                    ></textarea>
                    <button class="luxury-send-btn" id="luxurySendBtn" aria-label="Enviar mensaje">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatContainer);
}

// ═══════════════════════════════════════════════════════════════
// 🤖 LÓGICA DE LA IA (Google Gemini) - CORREGIDA
// ═══════════════════════════════════════════════════════════════

class GeminiAI {
    static async sendMessage(userMessage) {
        try {
            // Validar que la API Key esté configurada
            if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
                throw new Error('API_KEY_NOT_CONFIGURED');
            }

            const conversationHistory = ChatStorage.getConversationContext();
            
            // Estructura corregida del request
            const requestBody = {
                contents: [
                    // Sistema prompt como mensaje inicial
                    {
                        role: 'user',
                        parts: [{ text: SISTEMA_PROMPT }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Entendido. Actuaré como un asistente de lujo profesional y sofisticado.' }]
                    },
                    // Historial de conversación
                    ...conversationHistory,
                    // Mensaje actual del usuario
                    {
                        role: 'user',
                        parts: [{ text: userMessage }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            console.log('🚀 Enviando mensaje a Gemini...', {
                endpoint: `${API_ENDPOINT}?key=${API_KEY.substring(0, 10)}...`,
                messageLength: userMessage.length,
                historyLength: conversationHistory.length
            });

            const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 Respuesta recibida:', {
                status: response.status,
                ok: response.ok,
                statusText: response.statusText
            });

            const data = await response.json();
            
            // Log de la respuesta completa para debugging
            console.log('📦 Datos de respuesta:', data);

            if (!response.ok) {
                // Manejo específico de errores de la API
                if (data.error) {
                    const errorMessage = data.error.message || 'Error desconocido';
                    const errorCode = data.error.code || response.status;
                    
                    console.error('❌ Error de API:', {
                        code: errorCode,
                        message: errorMessage,
                        details: data.error
                    });

                    // Mensajes de error específicos
                    if (errorCode === 400) {
                        if (errorMessage.includes('API key')) {
                            throw new Error('API_KEY_INVALID');
                        }
                        throw new Error(`Error en la solicitud: ${errorMessage}`);
                    } else if (errorCode === 403) {
                        throw new Error('API_KEY_PERMISSION_DENIED');
                    } else if (errorCode === 429) {
                        throw new Error('RATE_LIMIT_EXCEEDED');
                    }
                    
                    throw new Error(errorMessage);
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // Validar la estructura de la respuesta
            if (!data.candidates || !data.candidates[0]) {
                console.error('❌ Estructura de respuesta inválida:', data);
                throw new Error('La API no devolvió candidatos de respuesta');
            }

            const candidate = data.candidates[0];

            // Verificar si la respuesta fue bloqueada
            if (candidate.finishReason === 'SAFETY') {
                throw new Error('CONTENT_BLOCKED_SAFETY');
            }

            if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
                console.error('❌ Contenido de respuesta inválido:', candidate);
                throw new Error('La respuesta no contiene contenido válido');
            }

            const responseText = candidate.content.parts[0].text;
            
            if (!responseText || responseText.trim() === '') {
                throw new Error('La respuesta está vacía');
            }

            console.log('✅ Mensaje procesado exitosamente');
            return responseText;
            
        } catch (error) {
            console.error('💥 Error en GeminiAI.sendMessage:', error);
            
            // Mensajes de error personalizados
            if (error.message === 'API_KEY_NOT_CONFIGURED') {
                return '⚠️ **Configuración requerida**\n\nPor favor, configura tu API Key de Google Gemini en el archivo chatbot.js.\n\n1. Obtén tu clave en: https://makersuite.google.com/app/apikey\n2. Reemplaza `TU_API_KEY_AQUI` con tu clave';
            }
            
            if (error.message === 'API_KEY_INVALID') {
                return '🔑 **API Key inválida**\n\nLa clave API proporcionada no es válida. Por favor:\n\n1. Verifica que copiaste la clave completa\n2. Asegúrate de que la API está activada en Google Cloud\n3. Genera una nueva clave si es necesario';
            }
            
            if (error.message === 'API_KEY_PERMISSION_DENIED') {
                return '🚫 **Acceso denegado**\n\nTu API Key no tiene permisos para usar Gemini. Verifica:\n\n1. Que la API de Generative Language esté habilitada\n2. Que tu proyecto tenga cuota disponible\n3. Que no haya restricciones de IP';
            }
            
            if (error.message === 'RATE_LIMIT_EXCEEDED') {
                return '⏱️ **Límite de solicitudes excedido**\n\nHas enviado demasiadas solicitudes. Por favor espera un momento antes de intentar nuevamente.';
            }
            
            if (error.message === 'CONTENT_BLOCKED_SAFETY') {
                return '🛡️ **Contenido bloqueado**\n\nTu mensaje fue bloqueado por las políticas de seguridad. Por favor, reformula tu pregunta.';
            }
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                return '🌐 **Error de conexión**\n\nNo se pudo conectar con el servidor. Verifica:\n\n1. Tu conexión a internet\n2. Que no haya bloqueadores de contenido activos\n3. La configuración CORS de tu servidor';
            }
            
            // Error genérico con detalles
            return `❌ **Error al procesar tu mensaje**\n\n${error.message}\n\nSi el problema persiste, revisa la consola del navegador (F12) para más detalles.`;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 💬 GESTIÓN DEL CHAT - MEJORADA
// ═══════════════════════════════════════════════════════════════

class ChatManager {
    constructor() {
        this.chatBody = document.getElementById('luxuryChatBody');
        this.chatInput = document.getElementById('luxuryChatInput');
        this.sendBtn = document.getElementById('luxurySendBtn');
        this.isProcessing = false;
        
        this.loadHistory();
        this.attachEventListeners();
    }
    
    loadHistory() {
        const history = ChatStorage.getHistory();
        
        // Limpiar mensaje de bienvenida si hay historial
        if (history.length > 0) {
            this.chatBody.innerHTML = '';
            
            history.forEach(msg => {
                this.addMessageToUI(msg.role, msg.content, false);
            });
            
            this.scrollToBottom();
        }
    }
    
    attachEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleSend());
        
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });
        
        // Auto-resize del textarea
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
        });
    }
    
    async handleSend() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isProcessing) return;
        
        // Limpiar mensaje de bienvenida si existe
        const welcomeMsg = this.chatBody.querySelector('.luxury-welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
        
        this.isProcessing = true;
        this.sendBtn.disabled = true;
        
        // Agregar mensaje del usuario
        this.addMessageToUI('user', message);
        ChatStorage.saveMessage('user', message);
        
        // Limpiar input
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        try {
            // Obtener respuesta de la IA
            const response = await GeminiAI.sendMessage(message);
            
            // Remover indicador de escritura
            this.hideTypingIndicator();
            
            // Agregar respuesta del bot
            this.addMessageToUI('bot', response);
            ChatStorage.saveMessage('bot', response);
            
        } catch (error) {
            console.error('Error al procesar mensaje:', error);
            this.hideTypingIndicator();
            this.addMessageToUI('bot', '❌ Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
        } finally {
            this.isProcessing = false;
            this.sendBtn.disabled = false;
            this.chatInput.focus();
        }
    }
    
    addMessageToUI(role, content, shouldScroll = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `luxury-message ${role}`;
        
        const avatar = role === 'user' ? '👤' : '✦';
        
        messageDiv.innerHTML = `
            <div class="luxury-message-avatar">${avatar}</div>
            <div class="luxury-message-content">${this.formatMessage(content)}</div>
        `;
        
        this.chatBody.appendChild(messageDiv);
        
        if (shouldScroll) {
            this.scrollToBottom();
        }
    }
    
    formatMessage(text) {
        // Escapar HTML para seguridad
        const escapeHtml = (unsafe) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
        
        let formatted = escapeHtml(text);
        
        // Convertir markdown básico
        // Negritas
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Cursivas
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // Código inline
        formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
        // Enlaces
        formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // Saltos de línea
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'luxury-typing-indicator';
        indicator.id = 'luxuryTypingIndicator';
        indicator.innerHTML = `
            <div class="luxury-message-avatar">✦</div>
            <div class="luxury-typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        this.chatBody.appendChild(indicator);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('luxuryTypingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    scrollToBottom() {
        requestAnimationFrame(() => {
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
        });
    }
    
    clearChat() {
        if (confirm('¿Estás seguro de que deseas eliminar todo el historial de conversaciones?')) {
            ChatStorage.clearHistory();
            this.chatBody.innerHTML = `
                <div class="luxury-welcome-message">
                    <div class="luxury-welcome-icon">✦</div>
                    <h4>Bienvenido</h4>
                    <p>¿En qué puedo asistirle hoy?</p>
                </div>
            `;
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎯 INICIALIZACIÓN - MEJORADA
// ═══════════════════════════════════════════════════════════════

function initializeLuxuryChatbot() {
    console.log('🚀 Iniciando Luxury Chatbot...');
    
    // Validar API Key y mostrar advertencia
    if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
        console.warn(`
╔═══════════════════════════════════════════════════════════════╗
║  ⚠️  CHATBOT: API KEY NO CONFIGURADA                          ║
╟───────────────────────────────────────────────────────────────╢
║  Para usar este chatbot necesitas:                            ║
║                                                                ║
║  1. Obtener una API Key de Google Gemini:                     ║
║     👉 https://makersuite.google.com/app/apikey              ║
║                                                                ║
║  2. Abrir el archivo chatbot.js                               ║
║                                                                ║
║  3. Buscar la línea:                                          ║
║     const API_KEY = 'TU_API_KEY_AQUI';                        ║
║                                                                ║
║  4. Reemplazar 'TU_API_KEY_AQUI' con tu clave real           ║
║                                                                ║
║  El chatbot funcionará, pero mostrará mensajes de error       ║
║  hasta que configures la API Key correctamente.               ║
╚═══════════════════════════════════════════════════════════════╝
        `);
    }
    
    try {
        // Inyectar estilos
        injectStyles();
        console.log('✅ Estilos inyectados');
        
        // Crear interfaz
        createChatInterface();
        console.log('✅ Interfaz creada');
        
        // Inicializar gestor del chat
        const chatManager = new ChatManager();
        console.log('✅ Chat Manager inicializado');
        
        // Event Listeners para controles
        const toggleBtn = document.getElementById('luxuryChatToggle');
        const closeBtn = document.getElementById('luxuryCloseChat');
        const clearBtn = document.getElementById('luxuryClearChat');
        const chatWindow = document.getElementById('luxuryChatWindow');
        
        if (!toggleBtn || !closeBtn || !clearBtn || !chatWindow) {
            throw new Error('No se pudieron encontrar todos los elementos del DOM');
        }
        
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                document.getElementById('luxuryChatInput').focus();
            }
        });
        
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
        
        clearBtn.addEventListener('click', () => {
            chatManager.clearChat();
        });
        
        console.log('✅ Event listeners configurados');
        console.log('✨ Luxury Chatbot inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error al inicializar el chatbot:', error);
        alert('Error al inicializar el chatbot. Revisa la consola para más detalles.');
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 AUTO-INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLuxuryChatbot);
} else {
    initializeLuxuryChatbot();
}
