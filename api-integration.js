// API Entegrasyonu için Chatbox Widget Genişletmesi
class ChatboxWidgetWithAPI extends ChatboxWidget {
    constructor(options = {}) {
        super(options);
        this.apiEndpoint = options.apiEndpoint || '/api/chat';
        this.apiKey = options.apiKey || '';
        this.enableAPI = options.enableAPI || false;
    }

    async handleResponse(userMessage) {
        if (this.enableAPI && this.apiEndpoint) {
            try {
                const response = await this.callAPI(userMessage);
                this.addMessage(response, 'bot');
            } catch (error) {
                console.error('API Error:', error);
                // Fallback to default responses
                super.handleResponse(userMessage);
            }
        } else {
            // Use default responses
            super.handleResponse(userMessage);
        }
    }

    async callAPI(message) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'X-API-Key': this.apiKey
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                sessionId: this.getSessionId()
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || data.message || 'Üzgünüm, şu anda size yardımcı olamıyorum.';
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('chatbox_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatbox_session_id', sessionId);
        }
        return sessionId;
    }

    // Send message to external service (e.g., email, CRM)
    async sendToExternalService(message, type = 'chat') {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    type: type,
                    timestamp: new Date().toISOString(),
                    sessionId: this.getSessionId()
                })
            });

            return response.ok;
        } catch (error) {
            console.error('External service error:', error);
            return false;
        }
    }

    // Connect to WebSocket for real-time chat
    connectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket('ws://localhost:8080/chat');
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.addMessage('Canlı destek temsilcisi bağlandı. Size nasıl yardımcı olabilirim?', 'bot');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.addMessage(data.message, 'bot');
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.addMessage('Canlı destek bağlantısı kesildi. Mesajınız kaydedildi, en kısa sürede size dönüş yapacağız.', 'bot');
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    // Override sendMessage to include WebSocket
    sendMessage() {
        const input = document.getElementById('chatboxInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Send to WebSocket if connected
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    message: message,
                    sessionId: this.getSessionId()
                }));
            } else {
                // Fallback to API or default responses
                setTimeout(() => {
                    this.handleResponse(message);
                }, 500);
            }
        }
    }
}

// Node.js Backend API Example (server.js)
/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Chat API endpoint
app.post('/api/chat', (req, res) => {
    const { message, sessionId } = req.body;
    
    // Simple response logic (you can integrate with AI services like OpenAI)
    let response = 'Üzgünüm, şu anda size yardımcı olamıyorum.';
    
    if (message.toLowerCase().includes('merhaba') || message.toLowerCase().includes('selam')) {
        response = 'Merhaba! Size nasıl yardımcı olabilirim?';
    } else if (message.toLowerCase().includes('fiyat') || message.toLowerCase().includes('ücret')) {
        response = 'Ürün fiyatları hakkında bilgi almak için ürün sayfalarını inceleyebilirsiniz.';
    } else if (message.toLowerCase().includes('kargo') || message.toLowerCase().includes('teslimat')) {
        response = 'Siparişleriniz 1-3 iş günü içinde kargoya verilmektedir.';
    } else if (message.toLowerCase().includes('iade')) {
        response = 'Ürünlerimizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.';
    }
    
    res.json({ response });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { message, type, sessionId } = req.body;
    
    // Here you can send email, save to database, etc.
    console.log('Contact form submitted:', { message, type, sessionId });
    
    res.json({ success: true, message: 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/

// Usage Examples:

// 1. Basic API Integration
const chatboxWithAPI = new ChatboxWidgetWithAPI({
    enableAPI: true,
    apiEndpoint: '/api/chat',
    apiKey: 'your-api-key-here',
    welcomeMessage: 'Merhaba! AI destekli canlı destek sistemimize hoş geldiniz.',
    quickReplies: [
        'Ürünler hakkında',
        'Sipariş durumu',
        'İade politikası',
        'Canlı temsilci'
    ]
});

// 2. WebSocket Integration
const chatboxWithWebSocket = new ChatboxWidgetWithAPI({
    welcomeMessage: 'Merhaba! Canlı destek temsilcimiz size yardımcı olacak.',
    quickReplies: [
        'Canlı temsilci ile konuş',
        'Sık sorulan sorular',
        'İletişim bilgileri'
    ]
});

// Connect to WebSocket when user clicks "Canlı temsilci ile konuş"
document.addEventListener('click', (e) => {
    if (e.target.dataset.reply === 'Canlı temsilci ile konuş') {
        chatboxWithWebSocket.connectWebSocket();
    }
});

// 3. Advanced Integration with External Services
const advancedChatbox = new ChatboxWidgetWithAPI({
    enableAPI: true,
    apiEndpoint: 'https://your-api.com/chat',
    apiKey: 'your-api-key',
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
    responses: {
        'Canlı temsilci': 'Canlı temsilciye bağlanıyorsunuz...',
        'Email gönder': 'Email adresinizi paylaşın, size dönüş yapalım.'
    }
});

// Send to external service when user asks for email
advancedChatbox.sendToExternalService('Kullanıcı email istedi', 'email_request');

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatboxWidgetWithAPI };
} else if (typeof window !== 'undefined') {
    window.ChatboxWidgetWithAPI = ChatboxWidgetWithAPI;
} 