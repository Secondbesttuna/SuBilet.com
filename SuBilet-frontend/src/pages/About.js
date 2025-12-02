import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Easter egg: Logo'ya 5 kez tıklayınca ekip fotoğrafı görünür
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowEasterEgg(true);
    }
  };

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="about-title" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            ✈️ ŞUBİLET
          </h1>
          <p className="about-subtitle">Türkiye'nin En Güvenilir Uçak Bileti Platformu</p>
          {clickCount > 0 && clickCount < 5 && (
            <small className="hint-text">🤫 {5 - clickCount} tıklama kaldı...</small>
          )}
        </section>

        {/* Hakkımızda */}
        <section className="about-section">
          <h2>🎯 Hakkımızda</h2>
          <p>
            ŞUBİLET, 2024 yılında Türkiye'nin önde gelen havayolu şirketleriyle iş birliği yaparak 
            kurulmuş bir online uçak bileti satış platformudur. Amacımız, seyahat etmeyi herkes 
            için kolay, hızlı ve uygun fiyatlı hale getirmektir.
          </p>
          <p>
            Modern teknolojimiz ve kullanıcı dostu arayüzümüz sayesinde, binlerce uçuş seçeneği 
            arasından size en uygun olanı saniyeler içinde bulabilirsiniz.
          </p>
        </section>

        {/* Özellikler */}
        <section className="about-section features-section">
          <h2>🚀 Neden ŞUBİLET?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3>En İyi Fiyatlar</h3>
              <p>Tüm havayollarından anlık fiyat karşılaştırması</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Güvenli Ödeme</h3>
              <p>256-bit SSL şifreleme ile korunan ödemeler</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3>Kolay Kullanım</h3>
              <p>Mobil uyumlu, hızlı ve sezgisel arayüz</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎫</span>
              <h3>Anında Bilet</h3>
              <p>Rezervasyonunuz anında e-posta ile gönderilir</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌍</span>
              <h3>Geniş Ağ</h3>
              <p>Türkiye genelinde 80+ havalimanı</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3>7/24 Destek</h3>
              <p>Her zaman yanınızda müşteri hizmetleri</p>
            </div>
          </div>
        </section>

        {/* İstatistikler */}
        <section className="about-section stats-section">
          <h2>📊 Rakamlarla ŞUBİLET</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Mutlu Yolcu</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">80+</span>
              <span className="stat-label">Havalimanı</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Havayolu Ortağı</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">%99.9</span>
              <span className="stat-label">Müşteri Memnuniyeti</span>
            </div>
          </div>
        </section>

        {/* Havayolu Ortakları */}
        <section className="about-section partners-section">
          <h2>🤝 Havayolu Ortaklarımız</h2>
          <div className="partners-grid">
            <div className="partner-card">
              <span className="partner-logo">🇹🇷</span>
              <span className="partner-name">Türk Hava Yolları</span>
            </div>
            <div className="partner-card">
              <span className="partner-logo">🟡</span>
              <span className="partner-name">Pegasus</span>
            </div>
            <div className="partner-card">
              <span className="partner-logo">🔴</span>
              <span className="partner-name">AnadoluJet</span>
            </div>
            <div className="partner-card">
              <span className="partner-logo">🟠</span>
              <span className="partner-name">SunExpress</span>
            </div>
          </div>
        </section>

        {/* Easter Egg - Ekip Fotoğrafı */}
        {showEasterEgg && (
          <section className="about-section team-section easter-egg">
            <h2>🎉 Gizli Bölümü Buldunuz!</h2>
            <p className="team-intro">
              ŞUBİLET'i geliştiren harika ekibimizle tanışın! 👋
            </p>
            <div className="team-photo-container">
              <img 
                src="/WhatsApp Image 2025-12-02 at 21.17.56.jpeg" 
                alt="ŞUBİLET Ekibi - Cansu, Ahmet, Tuna" 
                className="team-photo"
              />
            </div>
            <div className="team-members">
              <div className="team-member">
                <span className="member-emoji">👩‍💻</span>
                <span className="member-name">Cansu</span>
                <span className="member-role">Project Manager</span>
              </div>
              <div className="team-member">
                <span className="member-emoji">👨‍💻</span>
                <span className="member-name">Ahmet</span>
                <span className="member-role">Full Stack Developer</span>
              </div>
              <div className="team-member">
                <span className="member-emoji">👨‍💻</span>
                <span className="member-name">Tuna</span>
                <span className="member-role">Full Stack Developer</span>
              </div>
            </div>
            <p className="easter-egg-note">
              🐣 Bu gizli bölümü buldunuz! Projeyi geliştirirken çok eğlendik. 
              Umarız siz de kullanırken keyif alırsınız!
            </p>
          </section>
        )}

        {/* İletişim */}
        <section className="about-section contact-section">
          <h2>📞 İletişim</h2>
          <div className="contact-info">
            <p>📧 E-posta: info@subilet.com</p>
            <p>📱 Telefon: 0850 123 45 67</p>
            <p>📍 Adres: İstanbul, Türkiye</p>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h2>Hemen Uçuşunuzu Bulun!</h2>
          <p>Binlerce uçuş seçeneği arasından size en uygun olanı keşfedin.</p>
          <Link to="/" className="btn-cta">
            ✈️ Uçuş Ara
          </Link>
        </section>

        {/* Easter Egg Butonu */}
        {!showEasterEgg && (
          <div className="easter-egg-hint">
            <button onClick={() => setShowEasterEgg(true)} className="btn-easter-egg">
              🐣 Gizli bir şey mi var?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;

