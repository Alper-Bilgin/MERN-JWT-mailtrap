import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

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

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Şifrenizi sıfırlayın",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Şifre sıfırlama e-postası gönderilirken hata oluştu`, error);
    throw new Error(`Şifre sıfırlama e-postası gönderilirken hata oluştu: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Şifre Sıfırlama Başarılı",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });

    console.log("Şifre sıfırlama e-postası başarıyla gönderildi", response);
  } catch (error) {
    console.error(`Şifre sıfırlama başarılı e-postası gönderilirken hata oluştu:`, error);
    throw new Error(`Şifre sıfırlama başarılı e-postası gönderilirken hata oluştu: ${error}`);
  }
};
