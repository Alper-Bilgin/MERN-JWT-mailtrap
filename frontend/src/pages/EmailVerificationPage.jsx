import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  // 6 haneli kodu tutmak için state
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // Inputlara doğrudan erişmek için referans dizisi
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Her inputa yazıldığında çalışacak fonksiyon
  const handleChange = (index, value) => {
    const newCode = [...code];

    // Eğer kullanıcı tüm kodu yapıştırdıysa (örneğin: Ctrl+V)
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split(""); // En fazla 6 karakter alınır
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Otomatik olarak son dolu haneye veya ilk boş haneye odaklanılır
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      // Normal giriş yapıldığında sadece o haneyi günceller
      newCode[index] = value;
      setCode(newCode);

      // Eğer değer girildiyse bir sonraki inputa geçilir
      if (value && index < 5) {
        // Kullanıcı 1. kutuya rakam yazınca, otomatik olarak 2. kutuya geçsin.
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Klavye tuşlarına basıldığında çalışır (geri tuşuna özel işlem yapılır)
  const handleKeyDown = (index, e) => {
    // Geri tuşuna basıldıysa ve o input boşsa, bir önceki inputa odaklan
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Form gönderildiğinde çalışır (doğrulama isteği gönderir)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller

    const verificationCode = code.join(""); // Kod birleşip string hale getirilir

    try {
      setIsLoading(true); // Buton devre dışı bırakılır
      setError(null); // Hatalar temizlenir

      // E-posta doğrulama isteği gönderilir (verifyEmail fonksiyonu dışarıdan gelmeli)
      await verifyEmail(verificationCode);

      // Başarılı olursa ana sayfaya yönlendirilir
      navigate("/");

      // Başarılı bildirim mesajı gösterilir
      toast.success("E-posta başarıyla doğrulandı");
    } catch (error) {
      // Hata alındığında konsola yazılır ve kullanıcıya mesaj gösterilir
      console.log(error);
      setError("Kod doğrulanamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false); // Yükleme durumu kapatılır
    }
  };

  // Kullanıcı tüm alanları doldurduğunda otomatik olarak form gönderilir
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      // Tüm inputlar doluysa handleSubmit çağrılır
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    // Sayfa arka planı ve form kapsayıcısı
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      {/* İçeriğin animasyonla görünmesi */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Başlangıçta yukarıda ve opak değil
        animate={{ opacity: 1, y: 0 }} // Aşağıya iner ve görünür olur
        transition={{ duration: 0.5 }} // Animasyon süresi 0.5 saniye
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">E-postanızı Doğrulayın</h2>

        <p className="text-center text-gray-300 mb-6">E-posta adresinize gönderilen 6 haneli kodu girin.</p>

        {/* Doğrulama formu */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {/* Her bir karakter için ayrı input alanı */}
            {code.map((digit, index) => (
              <input
                key={index} // Her input benzersiz olmalı
                ref={(el) => (inputRefs.current[index] = el)} // Her input'u referanslara kaydet
                type="text"
                maxLength="6" // En fazla 6 karaktere izin verilir
                value={digit} // Değeri state üzerinden kontrol edilir
                onChange={(e) => handleChange(index, e.target.value)} // Değişim kontrolü
                onKeyDown={(e) => handleKeyDown(index, e)} // Klavye kontrolü
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

          {/* Hata varsa gösterilir */}
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          {/* Doğrula butonu */}
          <motion.button
            whileHover={{ scale: 1.05 }} // Üzerine gelince hafif büyüme
            whileTap={{ scale: 0.95 }} // Tıklanırken hafif küçülme
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)} // Yükleniyorsa veya eksik kod varsa buton pasif
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {/* Buton içeriği: yükleniyorsa metin değişir */}
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
