import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("Tüm alanları doldurun");
    }
    // Veritabanında aynı email ile kayıtlı bir kullanıcı var mı kontrol edilir
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "Bu email zaten kullanılıyor" });
    }

    // Şifre bcryptjs ile hashlenir (güvenlik için)
    const hashedPassword = await bcryptjs.hash(password, 10);
    // 6 haneli rastgele bir doğrulama kodu üretilir (kullanıcıya gönderilecek onay kodu)
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    // Yeni kullanıcı nesnesi oluşturulur
    const user = new User({
      email, // Kullanıcının email adresi
      password: hashedPassword, // Hashlenmiş şifre
      name, // Kullanıcının adı
      verificationToken, // Doğrulama kodu
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Doğrulama kodunun geçerlilik süresi (24 saat)
    });
    // Kullanıcı veritabanına kaydedilir
    await user.save();

    // Kullanıcıya JWT token oluşturulur ve cookie olarak gönderilir
    generateTokenAndSetCookie(res, user._id);
    // Kullanıcıya doğrulama emaili gönderilir
    await sendVerificationEmail(user.email, verificationToken);
    // Başarılı yanıt dönülür, kullanıcı bilgileri (şifre hariç) ile birlikte
    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      user: {
        ...user._doc, // Kullanıcıya ait tüm bilgiler
        password: undefined, // Şifre bilgisi gizlenir
      },
    });
  } catch (error) {
    // Hata oluşursa hata mesajı ile birlikte yanıt dönülür
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("Login");
};

export const logout = async (req, res) => {
  res.send("Logout");
};
