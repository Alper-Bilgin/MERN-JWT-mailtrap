import jwt from "jsonwebtoken";

// Bu fonksiyon, kullanıcıya ait bir JWT token oluşturur ve bu token'ı HTTP-only bir cookie olarak istemciye gönderir.
// Ayrıca oluşturulan token'ı fonksiyonun çıktısı olarak döndürür.
export const generateTokenAndSetCookie = (res, userId) => {
  // jwt.sign fonksiyonu ile bir JWT token oluşturuluyor.
  // Token'ın payload kısmında sadece userId bilgisi yer alıyor.
  // process.env.JWT_SECRET ile gizli anahtar kullanılıyor.
  // Token'ın geçerlilik süresi 7 gün olarak ayarlanıyor.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Oluşturulan token, HTTP-only bir cookie olarak istemciye gönderiliyor.
  // Cookie'nin adı 'token' olarak belirlenmiş.
  // httpOnly: true -> Cookie'ye JavaScript tarafından erişilemez, sadece sunucu tarafından erişilebilir.
  // secure: process.env.NODE_ENV !== "development" -> Geliştirme ortamı dışında (yani production'da) cookie sadece HTTPS üzerinden gönderilir.
  // sameSite: "strict" -> Cookie sadece aynı site üzerinden yapılan isteklere gönderilir, CSRF saldırılarına karşı koruma sağlar.
  // maxAge: 7 * 24 * 60 * 60 * 1000 -> Cookie'nin ömrü 7 gün (milisaniye cinsinden).
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
  });
  return token;
};
