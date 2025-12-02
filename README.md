# ✈️ ŞUBİLET - Uçuş Karşılaştırma ve Rezervasyon Sistemi

**ŞUBİLET**, Türkiye’deki farklı havayolu firmalarının (THY, Pegasus, AnadoluJet vb.) uçuşlarını tek bir platformda toplayarak kullanıcıların fiyat, saat ve aktarma bilgilerine göre karşılaştırma yapabilmesini sağlayan bir veritabanı yönetim sistemidir.

Bu proje, **TOBB Ekonomi ve Teknoloji Üniversitesi** 2025-2026 Güz Dönemi **BIL372 - Veritabanı Sistemleri** dersi kapsamında geliştirilmiştir.

---

## 📖 Proje Hakkında

Günümüzde kullanıcılar uçuş karşılaştırması yapmak için birden fazla siteyi ziyaret etmek zorunda kalmaktadır. [cite_start]ŞUBİLET, tüm büyük havayolu firmalarının verilerini merkezi bir veritabanında toplayarak kullanıcılara sade, hızlı ve güvenli bir çözüm sunmayı amaçlar.

Sistem, **Obilet** benzeri bir yapıya sahip olup, uçuş arama, filtreleme ve rezervasyon işlemlerinin arka plan veritabanı tasarımını ve yönetimini kapsamaktadır.

## 🚀 Özellikler

* **Uçuş Arama ve Filtreleme:** Kalkış-varış noktaları ve tarih bilgisine göre uçuşları listeleme; fiyat, saat ve aktarma kriterlerine göre filtreleme.
* **Rezervasyon Yönetimi:** Kullanıcıların seçtikleri uçuşlar için rezervasyon oluşturması (PNR, koltuk seçimi vb.).
* **Kullanıcı Profili:** Geçmiş rezervasyonları görüntüleme ve üyelik bilgileri güncelleme.
* **Ödeme Simülasyonu:** Kredi kartı veya diğer yöntemlerle ödeme işlemlerinin veritabanına kaydedilmesi.

## 🛠️ Kullanılan Teknolojiler

Proje, **web tabanlı** bir mimariye sahiptir ve aşağıdaki teknolojiler kullanılarak geliştirilmektedir:

* **Veritabanı:** MySQL
* **Backend:** Java 17, Maven, Spring Boot 3.4.12, Spring Data JPA, Lombok
* **Frontend:** React 19, React Router DOM, Axios, Modern CSS3, javascript

## 🗄️ Veritabanı Tasarımı (ER Modeli)

Sistemin veritabanı tasarımı aşağıdaki temel varlıklar üzerine kurulmuştur:

* **Customer (Müşteri):** Kullanıcı bilgileri.
* **Reservation (Rezervasyon):** Biletleme ve koltuk bilgileri.
* **Flight (Uçuş):** Kalkış-iniş tarihleri ve rotalar.
* **Airline & Aircraft:** Havayolu şirketleri ve uçak envanteri.
* **Payment (Ödeme):** İşlem kayıtları ve ödeme durumları.

## 👥 Proje Ekibi

| Öğrenci No | Ad Soyad | E-posta |
|------------|----------|---------|
| 231401023 | **Saadet Cansu Baktıroğlu** | sbaktiroglu@etu.edu.tr  |
| 231101058 | **Tuna Yılmaz** | tunayilmaz@etu.edu.tr  |
| 231104085 | **Ahmet Taha Özcan** | ahmettahaozcan@etu.edu.tr  |

## 🚀 Projeyi Çalıştırma



```bash
# Backend (H2 in-memory DB kullanır, otomatik verilerle)
cd SuBilet-backend
mvn spring-boot:run

# Frontend (yeni terminal)
cd SuBilet-frontend
npm install
npm start
```


## 📁 Proje Yapısı

```
SuBilet.com/
├── SuBilet-backend/     # Spring Boot REST API
│   ├── controller/      # HTTP Endpoints
│   ├── service/         # Business Logic
│   ├── entity/          # JPA Entities
│   ├── repository/      # Data Access
│   └── exception/       # Error Handling
│
└── SuBilet-frontend/    # React SPA
    ├── components/      # Navbar, Footer vb.
    ├── pages/          # Home, FlightSearch vb.
    └── services/       # API İstemcileri
```

---
*Bu proje, akademik bir çalışma olarak geliştirilmiştir.*
