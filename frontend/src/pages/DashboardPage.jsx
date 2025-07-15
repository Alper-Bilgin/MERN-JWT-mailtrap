import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  // Kullanıcı çıkışı işlemini tetikleyen fonksiyon
  const handleLogout = () => {
    logout();
  };

  return (
    // Sayfa yüklenme ve çıkış animasyonu ile sarmalanmış ana div
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // İlk durumda küçültülmüş ve şeffaf
      animate={{ opacity: 1, scale: 1 }} // Görünür ve normal boyuta animasyon
      exit={{ opacity: 0, scale: 0.9 }} // Çıkarken tekrar küçülme ve şeffaflık
      transition={{ duration: 0.5 }} // Animasyon süresi
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      {/* Başlık */}
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">KULLANICI PANELİ</h2>

      {/* İçerik alanı */}
      <div className="space-y-6">
        {/* Profil bilgileri kutusu */}
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }} // Başlangıçta aşağıdan ve şeffaf gelir
          animate={{ opacity: 1, y: 0 }} // Yukarı çıkar ve görünür olur
          transition={{ delay: 0.2 }} // Animasyon gecikmesi
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">Profil Bilgileri</h3>
          <p className="text-gray-300">Ad: {user.name}</p> {/* Kullanıcı adı */}
          <p className="text-gray-300">E-posta: {user.email}</p> {/* Kullanıcı e-posta */}
        </motion.div>

        {/* Hesap aktiviteleri kutusu */}
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }} // Başlangıç animasyonu
          animate={{ opacity: 1, y: 0 }} // Görünür animasyon
          transition={{ delay: 0.4 }} // Gecikmeli animasyon
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">Hesap Aktivitesi</h3>

          {/* Kullanıcının platforma katıldığı tarih */}
          <p className="text-gray-300">
            <span className="font-bold">Katılma Tarihi: </span>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Son giriş tarihi */}
          <p className="text-gray-300">
            <span className="font-bold">Son Giriş Zamanı: </span>
            {formatDate(user.lastLogin)} {/* formatDate fonksiyonu ile biçimlendirilmiş */}
          </p>
        </motion.div>
      </div>

      {/* Çıkış butonu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Animasyon başlangıcı
        animate={{ opacity: 1, y: 0 }} // Görünürlük animasyonu
        transition={{ delay: 0.6 }} // Gecikmeli
        className="mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }} // Üzerine gelince biraz büyür
          whileTap={{ scale: 0.95 }} // Tıklanınca biraz küçülür
          onClick={handleLogout} // Tıklama ile çıkış fonksiyonu tetiklenir
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
					font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Logout {/* Çıkış butonu metni */}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
