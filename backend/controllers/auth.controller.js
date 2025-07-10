import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
