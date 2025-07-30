# 💬 E-Ticaret Chatbox Widget

Modern e-ticaret siteleri için geliştirilmiş, özelleştirilebilir chatbox widget'ı. Hem hazır cevaplar hem de kullanıcı girişi destekler.

## 🌟 Özellikler

- ✅ **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ✅ **Hazır Cevaplar** - Sık sorulan sorular için hızlı yanıtlar
- ✅ **Kullanıcı Girişi** - Özel sorular için metin girişi
- ✅ **E-ticaret Entegrasyonu** - Mağaza özelinde özelleştirme
- ✅ **API Desteği** - Backend entegrasyonu için hazır
- ✅ **WebSocket Desteği** - Gerçek zamanlı canlı destek
- ✅ **Session Yönetimi** - Kullanıcı oturum takibi
- ✅ **Özelleştirilebilir** - Renk, boyut, mesaj özelleştirme

## 📁 Proje Yapısı

```
chatbox/
├── index.html                 # Temel demo sayfası
├── chatbox.js                # Ana widget sınıfı
├── api-integration.js        # API ve WebSocket entegrasyonu
├── integration-example.html  # E-ticaret entegrasyonu örneği
└── README.md                # Bu dosya
```

## 🚀 Kurulum

### 1. Temel Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/kullaniciadi/chatbox-widget.git
cd chatbox-widget

# Dosyaları görüntülemek için
python -m http.server 3000
# http://localhost:3000/index.html adresini ziyaret edin
```

### 2. E-ticaret Sitenize Entegrasyon

```html
<!DOCTYPE html>
<html>
<head>
    <title>E-ticaret Siteniz</title>
</head>
<body>
    <!-- Sitenizin içeriği -->
    
    <!-- Chatbox Widget'ını dahil edin -->
    <script src="chatbox.js"></script>
    <script>
        // Chatbox'ı başlatın
        const chatbox = new ChatboxWidget({
            welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
            quickReplies: [
                'Ürünler hakkında',
                'Sipariş durumu',
                'İade politikası',
                'Kargo bilgileri'
            ],
            responses: {
                'Ürünler hakkında': 'Ürünlerimiz hakkında detaylı bilgi için kategoriler bölümünü inceleyebilirsiniz.',
                'Sipariş durumu': 'Sipariş durumunuzu öğrenmek için hesabınıza giriş yapabilirsiniz.',
                'İade politikası': 'Ürünlerimizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.',
                'Kargo bilgileri': 'Siparişleriniz 1-3 iş günü içinde kargoya verilmektedir.'
            }
        });
    </script>
</body>
</html>
```

## ⚙️ Konfigürasyon

### Temel Ayarlar

```javascript
const chatbox = new ChatboxWidget({
    // Hoş geldin mesajı
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabilirim?',
    
    // Hızlı cevaplar
    quickReplies: [
        'Ürünler hakkında',
        'Sipariş durumu',
        'İade politikası'
    ],
    
    // Bot yanıtları
    responses: {
        'Ürünler hakkında': 'Ürünlerimiz hakkında detaylı bilgi...',
        'Sipariş durumu': 'Sipariş durumunuzu öğrenmek için...'
    },
    
    // Görsel ayarlar
    position: 'bottom-right', // bottom-left, top-right, top-left
    theme: 'light', // light, dark
    primaryColor: '#007bff'
});
```

### Gelişmiş Ayarlar

```javascript
const chatbox = new ChatboxWidget({
    // API entegrasyonu
    apiUrl: 'https://api.siteniz.com/chat',
    apiKey: 'your-api-key',
    
    // WebSocket bağlantısı
    websocketUrl: 'wss://ws.siteniz.com',
    
    // Özel stiller
    customCSS: `
        .chatbox { border-radius: 15px; }
        .quick-reply { background: #f8f9fa; }
    `,
    
    // Event handlers
    onMessage: (message) => {
        console.log('Yeni mesaj:', message);
    },
    
    onOpen: () => {
        console.log('Chatbox açıldı');
    }
});
```

## 🔌 API Entegrasyonu

### Backend API Örneği (Node.js)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Chat API endpoint'i
app.post('/api/chat', (req, res) => {
    const { message, sessionId } = req.body;
    
    // Mesaj analizi ve yanıt oluşturma
    let response = 'Üzgünüm, bu konuda size yardımcı olamıyorum.';
    
    if (message.includes('ürün')) {
        response = 'Ürünlerimiz hakkında detaylı bilgi için kategoriler bölümünü inceleyebilirsiniz.';
    } else if (message.includes('sipariş')) {
        response = 'Sipariş durumunuzu öğrenmek için hesabınıza giriş yapabilirsiniz.';
    }
    
    res.json({
        response,
        sessionId,
        timestamp: new Date().toISOString()
    });
});

app.listen(3000, () => {
    console.log('API server çalışıyor: http://localhost:3000');
});
```

### Frontend API Kullanımı

```javascript
// API entegrasyonu ile chatbox
const chatboxWithAPI = new ChatboxWidgetWithAPI({
    apiUrl: 'http://localhost:3000/api/chat',
    apiKey: 'your-secret-key',
    
    // API yanıtlarını işleme
    handleAPIResponse: (response) => {
        return response.response;
    },
    
    // Hata durumunda fallback
    fallbackResponse: 'Şu anda teknik bir sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.'
});
```

## 🛒 E-ticaret Entegrasyonu

### Ürün Sayfası Entegrasyonu

```javascript
// Ürün sayfasında chatbox
const productChatbox = new ChatboxWidget({
    welcomeMessage: 'Bu ürün hakkında sorularınızı yanıtlamaya hazırım!',
    
    quickReplies: [
        'Ürün özellikleri',
        'Stok durumu',
        'Kargo bilgisi',
        'Ödeme seçenekleri'
    ],
    
    responses: {
        'Ürün özellikleri': 'Bu ürünün özellikleri: [ürün detayları]',
        'Stok durumu': 'Bu ürün şu anda stokta mevcuttur.',
        'Kargo bilgisi': 'Bu ürün 1-3 iş günü içinde kargoya verilir.',
        'Ödeme seçenekleri': 'Kredi kartı, havale ve kapıda ödeme seçeneklerimiz bulunmaktadır.'
    }
});

// Sepete ekleme sonrası bildirim
function addToCart(productId) {
    // Sepete ekleme işlemi
    addProductToCart(productId);
    
    // Chatbox'ı aç ve bildirim göster
    productChatbox.open();
    setTimeout(() => {
        productChatbox.addMessage(`Ürün sepete eklendi! Başka bir ürün hakkında bilgi almak ister misiniz?`, 'bot');
    }, 1000);
}
```

### Sipariş Takip Entegrasyonu

```javascript
// Sipariş takip chatbox'ı
const orderChatbox = new ChatboxWidget({
    welcomeMessage: 'Sipariş durumunuzu öğrenmek için sipariş numaranızı yazabilirsiniz.',
    
    onMessage: async (message) => {
        if (message.match(/^\d{6,}$/)) {
            // Sipariş numarası formatında
            const orderStatus = await getOrderStatus(message);
            orderChatbox.addMessage(`Sipariş #${message} durumu: ${orderStatus}`, 'bot');
        }
    }
});
```

## 🎨 Özelleştirme

### CSS Özelleştirme

```css
/* Chatbox stillerini özelleştirme */
.chatbox-container {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --background-color: #ffffff;
    --text-color: #333333;
    --border-radius: 10px;
    --shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.chatbox {
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    background: var(--background-color);
}

.quick-reply {
    background: var(--primary-color);
    color: white;
    border-radius: 20px;
    padding: 8px 16px;
    margin: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-reply:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}
```

### JavaScript Özelleştirme

```javascript
// Özel event handler'lar
const customChatbox = new ChatboxWidget({
    onMessage: (message) => {
        // Mesaj gönderildiğinde
        console.log('Kullanıcı mesajı:', message);
        
        // Analytics tracking
        gtag('event', 'chat_message', {
            'event_category': 'engagement',
            'event_label': message
        });
    },
    
    onQuickReply: (reply) => {
        // Hızlı cevap seçildiğinde
        console.log('Hızlı cevap:', reply);
    },
    
    onOpen: () => {
        // Chatbox açıldığında
        console.log('Chatbox açıldı');
    },
    
    onClose: () => {
        // Chatbox kapandığında
        console.log('Chatbox kapandı');
    }
});
```

## 📊 Analytics ve Takip

### Google Analytics Entegrasyonu

```javascript
const analyticsChatbox = new ChatboxWidget({
    onMessage: (message) => {
        // Google Analytics event tracking
        gtag('event', 'chat_message', {
            'event_category': 'engagement',
            'event_label': message,
            'value': 1
        });
    },
    
    onQuickReply: (reply) => {
        gtag('event', 'quick_reply', {
            'event_category': 'engagement',
            'event_label': reply
        });
    }
});
```

### Özel Analytics

```javascript
// Chatbox kullanım istatistikleri
const chatboxStats = {
    totalMessages: 0,
    quickRepliesUsed: 0,
    sessionDuration: 0,
    startTime: null
};

const trackedChatbox = new ChatboxWidget({
    onOpen: () => {
        chatboxStats.startTime = Date.now();
    },
    
    onMessage: () => {
        chatboxStats.totalMessages++;
    },
    
    onQuickReply: () => {
        chatboxStats.quickRepliesUsed++;
    },
    
    onClose: () => {
        chatboxStats.sessionDuration = Date.now() - chatboxStats.startTime;
        console.log('Chatbox istatistikleri:', chatboxStats);
    }
});
```

## 🔒 Güvenlik

### API Güvenliği

```javascript
// Güvenli API entegrasyonu
const secureChatbox = new ChatboxWidgetWithAPI({
    apiUrl: 'https://api.siteniz.com/chat',
    apiKey: process.env.CHAT_API_KEY, // Environment variable kullanın
    
    // Request headers
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
    },
    
    // Rate limiting
    rateLimit: {
        maxRequests: 10,
        timeWindow: 60000 // 1 dakika
    }
});
```

### Input Validation

```javascript
// Mesaj doğrulama
const validatedChatbox = new ChatboxWidget({
    validateMessage: (message) => {
        // XSS koruması
        if (message.includes('<script>') || message.includes('javascript:')) {
            return false;
        }
        
        // Uzunluk kontrolü
        if (message.length > 500) {
            return false;
        }
        
        return true;
    },
    
    onInvalidMessage: (message) => {
        console.warn('Geçersiz mesaj:', message);
        return 'Mesajınız çok uzun veya geçersiz karakterler içeriyor.';
    }
});
```

## 🚀 Performans Optimizasyonu

### Lazy Loading

```javascript
// Chatbox'ı lazy load etme
document.addEventListener('DOMContentLoaded', () => {
    // Chatbox'ı sadece kullanıcı etkileşiminden sonra yükle
    let chatboxLoaded = false;
    
    const loadChatbox = () => {
        if (!chatboxLoaded) {
            import('./chatbox.js').then(() => {
                window.chatboxWidget = new ChatboxWidget();
                chatboxLoaded = true;
            });
        }
    };
    
    // Kullanıcı etkileşimi sonrası yükle
    document.addEventListener('click', loadChatbox, { once: true });
    document.addEventListener('scroll', loadChatbox, { once: true });
});
```

### Caching

```javascript
// Response caching
const cachedChatbox = new ChatboxWidgetWithAPI({
    cacheResponses: true,
    cacheExpiry: 300000, // 5 dakika
    
    handleAPIResponse: (response) => {
        // Cache'e kaydet
        localStorage.setItem(`chat_response_${response.query}`, JSON.stringify({
            response: response.response,
            timestamp: Date.now()
        }));
        
        return response.response;
    }
});
```

## 📱 Mobil Uyumluluk

### Responsive Tasarım

```css
/* Mobil optimizasyonu */
@media (max-width: 768px) {
    .chatbox {
        width: 100%;
        height: 100vh;
        border-radius: 0;
        position: fixed;
        top: 0;
        left: 0;
    }
    
    .chatbox-toggle {
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        font-size: 24px;
    }
    
    .quick-replies {
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .quick-reply {
        font-size: 14px;
        padding: 6px 12px;
    }
}
```

## 🧪 Test

### Manuel Test

```javascript
// Test fonksiyonları
const testChatbox = new ChatboxWidget({
    onMessage: (message) => {
        console.log('Test mesajı:', message);
        
        // Test yanıtları
        if (message === 'test') {
            return 'Test başarılı!';
        }
        
        if (message === 'error') {
            throw new Error('Test hatası');
        }
    }
});

// Test senaryoları
function runTests() {
    console.log('Chatbox testleri başlıyor...');
    
    // Mesaj gönderme testi
    testChatbox.sendMessage('test');
    
    // Hızlı cevap testi
    testChatbox.sendQuickReply('Ürünler hakkında');
    
    // Açma/kapama testi
    testChatbox.open();
    setTimeout(() => testChatbox.close(), 1000);
}
```

## 📈 Gelecek Özellikler

- [ ] **AI Destekli Yanıtlar** - ChatGPT entegrasyonu
- [ ] **Çoklu Dil Desteği** - i18n entegrasyonu
- [ ] **Sesli Mesajlar** - Voice-to-text desteği
- [ ] **Görsel Mesajlar** - Resim ve emoji desteği
- [ ] **Otomatik Çeviri** - Google Translate entegrasyonu

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 Destek

- **Email**: mehmetemingocen18@gmail.com
- **Web**: [https://www.mehmetemingocen.com.tr](https://www.mehmetemingocen.com.tr/)
- **GitHub Issues**: [Issues sayfası](https://github.com/mehmetemingocen/ecommerce-chatbox-widget/issues)
- **Dokümantasyon**: [Wiki sayfası](https://github.com/mehmetemingocen/ecommerce-chatbox-widget/wiki)

## 🙏 Teşekkürler

Bu projeyi geliştirmemize yardımcı olan tüm katkıda bulunanlara teşekkürler!

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!** 
