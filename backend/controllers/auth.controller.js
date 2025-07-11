import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

import { User } from "../models/user.model.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

dotenv.config();

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

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    // Veritabanında, doğrulama kodu eşleşen ve süresi geçmemiş bir kullanıcı ararız
    const user = await User.findOne({
      verificationToken: code, // Kullanıcının doğrulama kodu
      verificationTokenExpiresAt: { $gt: Date.now() }, // Kodun süresi geçmemiş olmalı
    });
    // Eğer kullanıcı bulunamazsa (kod yanlış veya süresi dolmuşsa) hata döneriz
    if (!user) {
      return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş doğrulama kodu" });
    }
    user.isVerified = true; // Kullanıcı bulunduysa, hesabı doğrulanmış olarak işaretleriz
    user.isVerificationToken = undefined; // Kullanıcının doğrulama kodunu sileriz (artık gerek yok)
    user.verificationTokenExpiresAt = undefined; // Doğrulama kodunun süresini de sileriz
    await user.save(); // Kullanıcıyı güncellenmiş haliyle kaydederiz
    await sendWelcomeEmail(user.email, user.name); // Kullanıcıya hoş geldin e-postası göndeririz
    res.status(200).json({
      success: true,
      message: "Email hesabı doğrulandı",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Doğrulama maili hatası ", error);
    res.status(500).json({ success: false, message: "Doğrulama Maili hatası" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Geçersiz kimlik bilgileri" });
    }

    // Bu kod, kullanıcının girdiği şifreyi (password), veritabanında hashlenmiş olarak saklanan şifreyle (user.password) karşılaştırır.
    // bcryptjs.compare fonksiyonu, şifrelerin eşleşip eşleşmediğini kontrol eder ve sonucu (true/false) olarak döndürür.

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Hatalı Parola" });
    }
    // Kullanıcı doğrulandıysa, JWT token oluşturulur ve cookie olarak gönderilir
    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date(); // Kullanıcının son giriş zamanı güncellenir
    await user.save(); // Kullanıcı bilgileri kaydedilir
    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Oturum açma hatası: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  // "token" isimli çerezi (cookie) temizler, böylece kullanıcı çıkış yapmış olur
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Çıkış işlemi başarılı" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    //Bu kod, güvenli bir şekilde rastgele bir şifre sıfırlama token'ı (jetonu) üretir.
    // crypto.randomBytes(20): Kriptografik olarak güvenli, 20 bayt uzunluğunda rastgele bir veri üretir.
    // .toString("hex"): Bu rastgele veriyi okunabilir bir 40 karakterlik hexadecimal stringe çevirir.
    // Genellikle şifre sıfırlama işlemlerinde, kullanıcıya gönderilecek benzersiz ve tahmin edilmesi zor bir token oluşturmak için kullanılır.

    const resetToken = crypto.randomBytes(20).toString("hex");
    // Token'ın geçerlilik süresi belirlenir (şu anki zamandan itibaren 30 dakika).
    // Bu süre geçtikten sonra token geçersiz hale gelir ve kullanıcı yeni bir istek yapmak zorundadır.
    const resetTokenExpiresAt = Date.now() + 30 * 60 * 1000; //30 dakika

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Kullanıcının e-posta adresine, şifre sıfırlama bağlantısı içeren bir e-posta gönderilir.
    // Bağlantı, istemci tarafındaki (frontend) reset-password sayfasına yönlendirilir ve token URL'ye eklenir.
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({ success: true, message: "Şifre sıfırlama bağlantısı e-postanıza gönderildi" });
  } catch (error) {
    console.log("forgotPassword'da hata ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş sıfırlama linki" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Şifre sıfırlandı" });
  } catch (error) {
    console.log("resetPassword'da hata ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Kullanıcı ID'sini, doğrulama işleminde token'dan almıştık ve şu anda 'req.userId' içinde mevcut
    // User modelinden kullanıcıyı bulmaya çalışıyoruz, password alanını sorgulardan hariç tutmak için select("-password") kullanıyoruz
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("checkAuth'ta hata ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
