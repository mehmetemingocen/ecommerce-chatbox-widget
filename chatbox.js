// Chatbox Widget for E-commerce Integration
class ChatboxWidget {
    constructor(options = {}) {
        this.options = {
            position: options.position || 'bottom-right',
            theme: options.theme || 'default',
            welcomeMessage: options.welcomeMessage || 'Merhaba! Size nasıl yardımcı olabilirim?',
            quickReplies: options.quickReplies || [
                'Ürünler hakkında',
                'Sipariş durumu',
                'İade politikası',
                'Kargo bilgileri'
            ],
            responses: options.responses || {},
            ...options
        };
        
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createStyles();
        this.createHTML();
        this.bindEvents();
        this.loadResponses();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chatbox-widget-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .chatbox-widget-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chatbox-widget-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }

            .chatbox-widget {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chatbox-widget.active {
                display: flex;
            }

            .chatbox-widget-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .chatbox-widget-header h3 {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
            }

            .chatbox-widget-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
            }

            .chatbox-widget-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
            }

            .chatbox-widget-message {
                margin-bottom: 15px;
                display: flex;
                align-items: flex-start;
            }

            .chatbox-widget-message.user {
                justify-content: flex-end;
            }

            .chatbox-widget-message-content {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
            }

            .chatbox-widget-message.bot .chatbox-widget-message-content {
                background: white;
                color: #333;
                border: 1px solid #e0e0e0;
            }

            .chatbox-widget-message.user .chatbox-widget-message-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .chatbox-widget-quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }

            .chatbox-widget-quick-reply {
                background: #e9ecef;
                border: 1px solid #dee2e6;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .chatbox-widget-quick-reply:hover {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .chatbox-widget-input {
                padding: 15px 20px;
                background: white;
                border-top: 1px solid #e0e0e0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .chatbox-widget-input input {
                flex: 1;
                border: 1px solid #e0e0e0;
                border-radius: 20px;
                padding: 10px 15px;
                font-size: 14px;
                outline: none;
            }

            .chatbox-widget-input input:focus {
                border-color: #667eea;
            }

            .chatbox-widget-send {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }

            .chatbox-widget-send:hover {
                transform: scale(1.1);
            }

            @media (max-width: 480px) {
                .chatbox-widget {
                    width: 300px;
                    height: 400px;
                    right: 10px;
                    bottom: 80px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createHTML() {
        const container = document.createElement('div');
        container.className = 'chatbox-widget-container';
        container.innerHTML = `
            <button class="chatbox-widget-toggle" id="chatboxToggle">💬</button>
            
            <div class="chatbox-widget" id="chatboxWidget">
                <div class="chatbox-widget-header">
                    <h3>Canlı Destek</h3>
                    <button class="chatbox-widget-close" id="chatboxClose">×</button>
                </div>
                
                <div class="chatbox-widget-messages" id="chatboxMessages">
                    <div class="chatbox-widget-message bot">
                        <div class="chatbox-widget-message-content">
                            ${this.options.welcomeMessage}
                            <div class="chatbox-widget-quick-replies">
                                ${this.options.quickReplies.map(reply => 
                                    `<div class="chatbox-widget-quick-reply" data-reply="${reply}">${reply}</div>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chatbox-widget-input">
                    <input type="text" id="chatboxInput" placeholder="Mesajınızı yazın...">
                    <button class="chatbox-widget-send" id="chatboxSend">➤</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
    }

    bindEvents() {
        const toggle = document.getElementById('chatboxToggle');
        const close = document.getElementById('chatboxClose');
        const send = document.getElementById('chatboxSend');
        const input = document.getElementById('chatboxInput');
        const messages = document.getElementById('chatboxMessages');

        toggle.addEventListener('click', () => this.toggle());
        close.addEventListener('click', () => this.toggle());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick reply events
        messages.addEventListener('click', (e) => {
            if (e.target.classList.contains('chatbox-widget-quick-reply')) {
                const reply = e.target.dataset.reply;
                this.sendQuickReply(reply);
            }
        });
    }

    toggle() {
        const widget = document.getElementById('chatboxWidget');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            widget.classList.add('active');
        } else {
            widget.classList.remove('active');
        }
    }

    sendQuickReply(text) {
        this.addMessage(text, 'user');
        setTimeout(() => {
            this.handleResponse(text);
        }, 500);
    }

    sendMessage() {
        const input = document.getElementById('chatboxInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            setTimeout(() => {
                this.handleResponse(message);
            }, 500);
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatboxMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbox-widget-message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbox-widget-message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    loadResponses() {
        // Default responses for e-commerce
        this.defaultResponses = {
            'Ürünler hakkında': 'Ürünlerimiz hakkında detaylı bilgi için kategoriler bölümünü inceleyebilirsiniz. Her ürün için detaylı açıklama ve fotoğraflar bulunmaktadır.',
            'Sipariş durumu': 'Sipariş durumunuzu öğrenmek için hesabınıza giriş yapıp "Siparişlerim" bölümünü kontrol edebilirsiniz. Sipariş numaranızı da paylaşırsanız size yardımcı olabilirim.',
            'İade politikası': 'Ürünlerimizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Ürün orijinal ambalajında ve kullanılmamış olmalıdır. Değişim işlemleri için müşteri hizmetlerimizle iletişime geçebilirsiniz.',
            'Kargo bilgileri': 'Siparişleriniz 1-3 iş günü içinde kargoya verilmektedir. Kargo ücreti 50 TL üzeri alışverişlerde ücretsizdir. Teslimat süresi 1-3 iş günüdür.',
            'default': 'Mesajınız için teşekkürler. En kısa sürede size dönüş yapacağız. Acil bir durum varsa 0850 123 45 67 numaralı telefonu arayabilirsiniz.'
        };

        // Merge with custom responses
        this.responses = { ...this.defaultResponses, ...this.options.responses };
    }

    handleResponse(userMessage) {
        let response = this.responses.default;
        
        // Check for exact matches first
        for (let key in this.responses) {
            if (key !== 'default' && userMessage.toLowerCase().includes(key.toLowerCase())) {
                response = this.responses[key];
                break;
            }
        }

        // Check for specific keywords
        if (userMessage.toLowerCase().includes('fiyat') || userMessage.toLowerCase().includes('ücret')) {
            response = 'Ürün fiyatları hakkında bilgi almak için ürün sayfalarını inceleyebilirsiniz. Kampanya ve indirimler için e-bültenimize abone olabilirsiniz.';
        } else if (userMessage.toLowerCase().includes('ödeme') || userMessage.toLowerCase().includes('kart')) {
            response = 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz bulunmaktadır. Tüm ödeme işlemleriniz SSL sertifikası ile güvence altındadır.';
        } else if (userMessage.toLowerCase().includes('kargo') || userMessage.toLowerCase().includes('teslimat')) {
            response = 'Siparişleriniz 1-3 iş günü içinde kargoya verilmektedir. Kargo ücreti 50 TL üzeri alışverişlerde ücretsizdir. Teslimat süresi 1-3 iş günüdür.';
        }

        this.addMessage(response, 'bot');
    }

    // Public methods for external control
    open() {
        if (!this.isOpen) this.toggle();
    }

    close() {
        if (this.isOpen) this.toggle();
    }

    setResponses(responses) {
        this.responses = { ...this.defaultResponses, ...responses };
    }

    setWelcomeMessage(message) {
        this.options.welcomeMessage = message;
        const firstMessage = document.querySelector('.chatbox-widget-message.bot .chatbox-widget-message-content');
        if (firstMessage) {
            firstMessage.innerHTML = message + this.createQuickRepliesHTML();
        }
    }

    createQuickRepliesHTML() {
        return `<div class="chatbox-widget-quick-replies">
            ${this.options.quickReplies.map(reply => 
                `<div class="chatbox-widget-quick-reply" data-reply="${reply}">${reply}</div>`
            ).join('')}
        </div>`;
    }
}

// Auto-initialize if script is loaded
if (typeof window !== 'undefined') {
    window.ChatboxWidget = ChatboxWidget;
    
    // Auto-initialize with default settings
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.chatboxWidget) {
            window.chatboxWidget = new ChatboxWidget();
        }
    });
} 