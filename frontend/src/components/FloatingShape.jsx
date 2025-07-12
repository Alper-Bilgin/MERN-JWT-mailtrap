import { motion } from "framer-motion";

// FloatingShape bileşeni tanımlanıyor.
// Bu bileşen, sayfa üzerinde animasyonlu bir şekilde dolaşan yuvarlak bir şekil oluşturur.
const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    // motion.div: framer-motion'un animasyonlu bir <div> bileşeni.
    <motion.div
      // Şeklin stilleri:
      // - 'absolute': Konumlandırmayı mutlak yapar, üst ve sol değerlerine göre konumlanır.
      // - 'rounded-full': Tam daire olacak şekilde köşe yuvarlatma.
      // - 'color' ve 'size': Props olarak dışarıdan alınır, örneğin 'bg-blue-500', 'w-32 h-32' gibi Tailwind sınıfları.
      // - 'opacity-20': Saydamlık değeri %20.
      // - 'blur-xl': Büyük bulanıklık efekti.
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      // Inline cssi ile div'in başlangıç konumu ayarlanıyor (top ve left değerleri props olarak verilir)
      style={{ top, left }}
      // animate özelliği ile div'e uygulanacak animasyonlar tanımlanıyor:
      // - y: Y ekseninde yukarıdan aşağıya ve tekrar yukarıya hareket eder.
      // - x: X ekseninde sağa doğru ve tekrar sola hareket eder.
      // - rotate: Saat yönünde 0°'den 360°'ye kadar döner.
      animate={{
        y: ["0%", "100%", "0%"], // Yukarıdan aşağıya ve tekrar yukarı
        x: ["0%", "100%", "0%"], // Sola-sağa ve tekrar sola
        rotate: [0, 360], // Dönme animasyonu (0° → 360°)
      }}
      // transition özelliği ile animasyon süresi ve davranışı tanımlanıyor:
      // - duration: Animasyonun süresi (20 saniye)
      // - ease: Hareketin hız eğrisi ("linear" → sabit hız)
      // - repeat: Sonsuz döngü
      // - delay: Her şeklin animasyonunun farklı zamanlarda başlaması için gecikme süresi (props ile alınır)
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      // Erişilebilirlik için bu öğe ekrana görsel amaçlı olduğu için gizli tanımlanır
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
