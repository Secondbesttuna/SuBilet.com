# ✈️ ŞUBİLET - Uçuş Karşılaştırma ve Rezervasyon Sistemi

[cite_start]**ŞUBİLET**, Türkiye’deki farklı havayolu firmalarının (THY, Pegasus, AnadoluJet vb.) uçuşlarını tek bir platformda toplayarak kullanıcıların fiyat, saat ve aktarma bilgilerine göre karşılaştırma yapabilmesini sağlayan bir veritabanı yönetim sistemidir[cite: 11].

[cite_start]Bu proje, **TOBB Ekonomi ve Teknoloji Üniversitesi** 2025-2026 Güz Dönemi **BIL372 - Veritabanı Sistemleri** dersi kapsamında geliştirilmiştir[cite: 1, 2, 3].

---

## 📖 Proje Hakkında

Günümüzde kullanıcılar uçuş karşılaştırması yapmak için birden fazla siteyi ziyaret etmek zorunda kalmaktadır. [cite_start]ŞUBİLET, tüm büyük havayolu firmalarının verilerini merkezi bir veritabanında toplayarak kullanıcılara sade, hızlı ve güvenli bir çözüm sunmayı amaçlar[cite: 36, 37].

[cite_start]Sistem, **Obilet** benzeri bir yapıya sahip olup, uçuş arama, filtreleme ve rezervasyon işlemlerinin arka plan veritabanı tasarımını ve yönetimini kapsamaktadır[cite: 11].

## 🚀 Özellikler

* [cite_start]**Uçuş Arama ve Filtreleme:** Kalkış-varış noktaları ve tarih bilgisine göre uçuşları listeleme; fiyat, saat ve aktarma kriterlerine göre filtreleme[cite: 39, 72].
* [cite_start]**Rezervasyon Yönetimi:** Kullanıcıların seçtikleri uçuşlar için rezervasyon oluşturması (PNR, koltuk seçimi vb.)[cite: 41, 50].
* [cite_start]**Kullanıcı Profili:** Geçmiş rezervasyonları görüntüleme ve üyelik bilgileri güncelleme[cite: 87, 98].
* [cite_start]**Ödeme Simülasyonu:** Kredi kartı veya diğer yöntemlerle ödeme işlemlerinin veritabanına kaydedilmesi[cite: 90, 97].

## 🛠️ Kullanılan Teknolojiler

[cite_start]Proje, **web tabanlı** bir mimariye sahiptir ve aşağıdaki teknolojiler kullanılarak geliştirilmektedir[cite: 75, 76, 77]:

* **Veritabanı:** PostgreSQL
* **Backend:** Java 17, Maven, Spring Boot 3.4.12, Spring Data JPA, Lombok
* **Frontend:** React 19, React Router DOM, Axios, Modern CSS3

## 🗄️ Veritabanı Tasarımı (ER Modeli)

[cite_start]Sistemin veritabanı tasarımı aşağıdaki temel varlıklar üzerine kurulmuştur[cite: 45]:

* **Customer (Müşteri):** Kullanıcı bilgileri.
* **Reservation (Rezervasyon):** Biletleme ve koltuk bilgileri.
* **Flight (Uçuş):** Kalkış-iniş tarihleri ve rotalar.
* **Airline & Aircraft:** Havayolu şirketleri ve uçak envanteri.
* **Payment (Ödeme):** İşlem kayıtları ve ödeme durumları.

## 👥 Proje Ekibi

| Öğrenci No | Ad Soyad | E-posta |
|------------|----------|---------|
| 231401023 | [cite_start]**Saadet Cansu Baktıroğlu** | sbaktiroglu@etu.edu.tr [cite: 7] |
| 231101058 | [cite_start]**Tuna Yılmaz** | tunayilmaz@etu.edu.tr [cite: 8] |
| 231104085 |  [cite_start]**Ahmet Taha Özcan** | ahmettahaozcan@etu.edu.tr [cite: 9] |

## 🚀 Projeyi Çalıştırma

⚡ **[START-WITHOUT-SQL.md](START-WITHOUT-SQL.md)** - SQL'siz hemen başlat! (ÖNERİLEN)

📖 **[QUICKSTART.md](QUICKSTART.md)** - MySQL ile 3 adımda başlat

📚 **[SETUP.md](SETUP.md)** - Detaylı kurulum rehberi

### En Hızlı Başlangıç (SQL Gereksiz!)

```bash
# Backend (H2 in-memory DB kullanır, otomatik verilerle)
cd SuBilet-backend
mvn spring-boot:run

# Frontend (yeni terminal)
cd SuBilet-frontend
npm install
npm start
```

> **Not**: Backend **H2 in-memory database** ile çalışır, MySQL/PostgreSQL kurulumuna gerek yok! 
> Veriler otomatik yüklenir: 30+ uçuş, 8 havalimanı, 4 havayolu

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
