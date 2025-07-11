import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // İstekten gelen 'token' bilgisini 'cookies' üzerinden alıyoruz
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Erişim engellendi, token eksik!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Eğer token geçersizse veya doğrulama başarısız olursa, hata mesajı dönülüyor
    if (!decoded) {
      return res.status(401).json({ message: "Geçersiz token!" });
    }

    // Token başarılı bir şekilde doğrulandıysa, kullanıcı bilgisi (userId) request objesine eklenir
    req.userId = decoded.userId;

    // 'next()' fonksiyonu ile sonraki middleware ya da route handler'a geçilir
    next();
  } catch (error) {
    console.log("verifyToken'da hata ", error);
    return res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};
