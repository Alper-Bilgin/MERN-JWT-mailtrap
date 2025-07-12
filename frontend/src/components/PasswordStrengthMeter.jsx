import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  // Her bir kriter için bir label (açıklama)
  //   met, burada bir boolean (true/false) değerdir. Her bir şifre kriterinin karşılanıp karşılanmadığını belirtmek için kullanılır.
  const criteria = [
    { label: "En az 6 karakter olmalı", met: password.length >= 6 }, // En az 6 karakter içeriyor mu?
    { label: "Büyük harf içermeli", met: /[A-Z]/.test(password) }, // Büyük harf içeriyor mu?
    { label: "Küçük harf içermeli", met: /[a-z]/.test(password) }, // Küçük harf içeriyor mu?
    { label: "Sayı içermeli", met: /\d/.test(password) }, // Sayı içeriyor mu?
    { label: "Özel karakter içermeli", met: /[^A-Za-z0-9]/.test(password) }, // Özel karakter içeriyor mu?
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {/* Kriter karşılandıysa yeşil onay ikonu, karşılanmadıysa gri çarpı ikonu göster */}
          {item.met ? <Check className="size-4 text-green-500 mr-2" /> : <X className="size-4 text-gray-500 mr-2" />}
          {/* Kriterin açıklamasını, karşılandıysa yeşil, değilse gri renkte yaz */}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;

    // Her kriter karşılandıkça strength değeri 1 artırılır
    if (pass.length >= 6) strength++; // Uzunluk kontrolü
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++; // Hem küçük hem büyük harf
    if (pass.match(/\d/)) strength++; // Sayı
    if (pass.match(/[^a-zA-Z\d]/)) strength++; // Özel karakter

    return strength; // Toplam puan (0–4 arası)
  };

  // Hesaplanan şifre gücü
  const strength = getStrength(password);

  // Güç seviyesine göre renk döndüren fonksiyon
  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500"; // Çok zayıf
    if (strength === 1) return "bg-red-400"; // Zayıf
    if (strength === 2) return "bg-yellow-500"; // Orta
    if (strength === 3) return "bg-yellow-400"; // İyi
    return "bg-green-500"; // Güçlü
  };

  // Güç seviyesine göre açıklama metni döndüren fonksiyon
  const getStrengthText = (strength) => {
    if (strength === 0) return "Çok Zayıf";
    if (strength === 1) return "Zayıf";
    if (strength === 2) return "Orta";
    if (strength === 3) return "İyi";
    return "Güçlü";
  };

  return (
    <div className="mt-2">
      {/* Başlık ve şifre gücünü yazı olarak gösteren alan */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Şifre Zorluğu:</span>
        <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
      </div>

      {/* Şifre gücünü gösteren çubuklar */}
      <div className="flex space-x-1">
        {/* 4 adet çubuk çizilir */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`
              h-1 w-1/4 rounded-full transition-colors duration-300 
              ${index < strength ? getColor(strength) : "bg-gray-600"} 
            `}
          />
        ))}
      </div>

      {/* Şifre kriterleri listesi gösterilir */}
      <PasswordCriteria password={password} />
    </div>
  );
};

// Ana bileşen dışa aktarılır
export default PasswordStrengthMeter;
