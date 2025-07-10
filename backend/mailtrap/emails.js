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

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "c4524148-88f7-45c3-83d5-03392d2668d0",
      template_variables: {
        name: name,
        company_info_name: "Alper Bilgin",
      },
    });

    console.log("Hoş geldiniz e-postası başarıyla gönderildi", response);
  } catch (error) {
    console.error(`Hoş geldiniz e-postası gönderilirken hata oluştu`, error);

    throw new Error(`Hoş geldiniz e-postası gönderilirken hata oluştu: ${error}`);
  }
};
