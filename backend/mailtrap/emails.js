import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  // Alıcıyı (recipient) bir nesne olarak tanımlarız. Mailtrap API'si bu formatı bekler.
  const recipient = [
    {
      email,
    },
  ];
  try {
    // mailtrapClient.send fonksiyonu ile e-posta gönderme işlemi yapılır
    // from: sender -> Gönderen bilgisi (Mailtrap yapılandırmasından gelir)
    // to: recipient -> Alıcı bilgisi (yukarıda tanımlandı)
    // subject -> E-postanın konu başlığı
    // html -> E-posta içeriği. Şablondaki {verificationCode} kısmı, fonksiyona gelen verificationToken ile değiştirilir
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "E-posta Adresinizi Doğrulayın",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Verification Email",
    });
    console.log("E-posta gönderildi:", response);
  } catch (error) {
    console.error("Doğrulama e-postası gönderimi hatası:", error);
    throw new Error("Doğrulama e-postası gönderimi hatası:", error);
  }
};
