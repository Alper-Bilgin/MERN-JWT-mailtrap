import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Store'dan loading durumu ve şifre sıfırlama fonksiyonu alınır
  const { isLoading, forgotPassword } = useAuthStore();

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
    await forgotPassword(email); // E-posta ile sıfırlama bağlantısı gönderilir
    setIsSubmitted(true); // Gönderim tamamlandı olarak işaretlenir
  };

  return (
    // Sayfa yüklenme animasyonu
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Başlangıçta sayfa aşağıda ve şeffaf olur
      animate={{ opacity: 1, y: 0 }} // Sayfa görünür hale gelir ve yukarı çıkar
      transition={{ duration: 0.5 }} // Animasyon süresi
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        {/* Başlık */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Şifremi Unuttum!</h2>

        {/* Form henüz gönderilmediyse gösterilecek alan */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            {/* Bilgilendirici metin */}
            <p className="text-gray-300 mb-6 text-center">E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.</p>

            {/* E-posta input alanı */}
            <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />

            {/* Gönder butonu */}
            <motion.button
              whileHover={{ scale: 1.02 }} // Üzerine gelindiğinde buton biraz büyür
              whileTap={{ scale: 0.98 }} // Tıklandığında küçülür
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
            >
              {/* Yükleniyorsa spinner göster, değilse buton metni */}
              {isLoading ? <Loader className="size-6 animate-spin mx-auto" /> : "Şifre Sıfırlama Bağlantısı Gönder"}
            </motion.button>
          </form>
        ) : (
          // Form gönderildikten sonra gösterilecek alan
          <div className="text-center">
            {/* Animasyonlu başarı ikonu */}
            <motion.div
              initial={{ scale: 0 }} // Başlangıçta görünmez
              animate={{ scale: 1 }} // Sonradan belirir
              transition={{ type: "spring", stiffness: 500, damping: 30 }} // Yay animasyonu
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>

            {/* Kullanıcıya gönderim bildirimi */}
            <p className="text-gray-300 mb-6">{email}, bu e-posta adresine şifrenizi sıfırlamanız için bir bağlantı isteği alacaksınız.</p>
          </div>
        )}
      </div>

      {/* Sayfanın alt kısmındaki geri dönüş bağlantısı */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link to={"/login"} className="text-sm text-green-400 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Anasayfaya dön
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
