import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Store'dan ilgili işlemler ve durumlar alınır
  const { resetPassword, error, isLoading, message } = useAuthStore();

  // URL'den token parametresi alınır
  const { token } = useParams();
  const navigate = useNavigate();

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engeller
    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor");
      return;
    }

    try {
      await resetPassword(token, password);

      // Başarı bildirimi gösterilir
      toast.success("Şifre başarıyla sıfırlandı, giriş sayfasına yönlendiriliyorsunuz...");
      // 2 saniye sonra giriş sayfasına yönlendirme yapılır
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Hata varsa konsola yazılır ve kullanıcıya bildirilir
      console.error(error);
      toast.error(error.message || "Şifre sıfırlama hatası");
    }
  };

  return (
    // Sayfa açılış animasyonu
    <motion.div
      initial={{ opacity: 0, y: 20 }} // İlk pozisyon ve görünürlük
      animate={{ opacity: 1, y: 0 }} // Son pozisyon ve görünürlük
      transition={{ duration: 0.5 }} // Animasyon süresi
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        {/* Başlık */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Şifre Sıfırlama</h2>

        {/* Hata varsa gösterilir */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Başarılı mesaj varsa gösterilir */}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        {/* Şifre sıfırlama formu */}
        <form onSubmit={handleSubmit}>
          {/* Yeni şifre girişi */}
          <Input icon={Lock} type="password" placeholder="Yeni Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {/* Yeni şifre tekrar girişi */}
          <Input icon={Lock} type="password" placeholder="Yeni Şifreyi Onayla" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

          {/* Gönder butonu */}
          <motion.button
            whileHover={{ scale: 1.03 }} // Hover animasyonu
            whileTap={{ scale: 0.97 }} // Tıklama animasyonu
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading} // İşlem devam ediyorsa buton devre dışı
          >
            {/* Yüklenme durumu gösterimi */}
            {isLoading ? "Sıfırlanıyor..." : "Yeni Şifre Belirle"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
