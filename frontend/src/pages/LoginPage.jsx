import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const LoginPage = () => {
  // Kullanıcının girdiği e-posta ve şifre bilgilerini tutmak için state'ler tanımlanıyor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Opsiyonel: Hata ve yüklenme durumu yönetimi için state
  const [error, setError] = useState(null); // Hataları göstermek için
  const [isLoading, setIsLoading] = useState(false); // Buton yüklenme animasyonu için

  // Giriş formunun submit edildiğinde çalışacak fonksiyon
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Yükleme durumunu başlat
      setError(null); // Önceki hataları temizle

      // login fonksiyonu ile kullanıcı giriş işlemi yapılır
      await login(email, password);
    } catch (err) {
      // Hata alınırsa hata mesajı gösterilir
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // İlk başta görünmez ve hafif aşağıda başlar
      animate={{ opacity: 1, y: 0 }} // Görünür olur ve yukarı doğru çıkar
      transition={{ duration: 0.5 }} // Animasyon süresi 0.5 saniye
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Form içerikleri */}
      <div className="p-8">
        {/* Başlık */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Tekrar Hoşgeldiniz</h2>

        {/* Giriş formu */}
        <form onSubmit={handleLogin}>
          {/* Email input alanı */}
          <Input icon={Mail} type="email" placeholder="Email Adresi" value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* Şifre input alanı */}
          <Input icon={Lock} type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />

          {/* Şifremi unuttum linki */}
          <div className="flex items-center mb-6">
            <Link to="/forgot-password" className="text-sm text-green-400 hover:underline">
              Şifremi Unuttum?
            </Link>
          </div>

          {/* Eğer bir hata varsa kullanıcıya gösterilir */}
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          {/* Giriş butonu */}
          <motion.button
            whileHover={{ scale: 1.03 }} // Üzerine gelince buton hafif büyür
            whileTap={{ scale: 0.97 }} // Tıklanırken hafif küçülür
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading} // Yükleme sırasında buton pasif hale getirilir
          >
            {/* Yükleniyorsa dönen ikon, değilse yazı */}
            {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
          </motion.button>
        </form>
      </div>

      {/* Sayfanın alt kısmında kayıt olma bağlantısı */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Hesabınız yok mu?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
