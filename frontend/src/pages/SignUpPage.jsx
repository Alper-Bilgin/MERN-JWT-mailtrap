import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState(""); // Ad soyad alanı
  const [email, setEmail] = useState(""); // Email alanı
  const [password, setPassword] = useState(""); // Şifre alanı

  // Sayfa yönlendirme fonksiyonu
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  // Kayıt olma işlemini yöneten fonksiyon
  const handleSignUp = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle

    try {
      await signup(email, password, name);
      // Başarılı olursa kullanıcıyı e-posta doğrulama sayfasına yönlendir
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // Sayfaya girişte animasyonla gelen dış kapsayıcı div çerçeve
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Başlangıçta görünmez ve hafif aşağıda
      animate={{ opacity: 1, y: 0 }} // Yavaşça yukarı çıkar ve görünür olur
      transition={{ duration: 0.5 }} // Animasyon süresi: 0.5 saniye
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      {/* İçerik alanı */}
      <div className="p-8">
        {/* Başlık */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Hesap Oluştur</h2>

        {/* Kayıt formu */}
        <form onSubmit={handleSignUp}>
          {/* Ad soyad alanı */}
          <Input icon={User} type="text" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} />

          {/* Email adresi alanı */}
          <Input icon={Mail} type="email" placeholder="Email Adresi" value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* Şifre alanı */}
          <Input icon={Lock} type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />

          {/* Hata mesajı varsa gösterilir */}
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          {/* Şifre gücü ölçer bileşen */}
          <PasswordStrengthMeter password={password} />

          {/* Kayıt ol butonu */}
          <motion.button
            type="submit"
            disabled={isLoading} // Yükleme sırasında buton devre dışı
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }} // Üzerine gelindiğinde hafif büyüt
            whileTap={{ scale: 0.98 }} // Tıklanırken hafif küçült
          >
            {/* Yükleniyorsa dönen simge, değilse yazı */}
            {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
          </motion.button>
        </form>
      </div>

      {/* Alt kısım: Giriş bağlantısı */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Zaten bir hesabın var mı?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
