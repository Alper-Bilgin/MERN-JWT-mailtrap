// Kullanıcıya e-posta doğrulama kodunu göndermek için kullanılan şablon
export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-posta Adresinizi Doğrulayın</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">E-posta Adresinizi Doğrulayın</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Merhaba,</p>
    <p>Kayıt olduğunuz için teşekkürler! Doğrulama kodunuz:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Kayıt işleminizi tamamlamak için bu kodu doğrulama sayfasına giriniz.</p>
    <p>Güvenlik nedeniyle bu kod 15 dakika sonra geçersiz olacaktır.</p>
    <p>Eğer bu hesabı siz oluşturmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
    <p>Saygılarımızla,<br>Uygulama Ekibiniz</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Bu otomatik bir mesajdır, lütfen yanıtlamayınız.</p>
  </div>
</body>
</html>
`;

// Şifrenin başarıyla sıfırlandığını bildiren e-posta şablonu
export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Başarıyla Sıfırlandı</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Şifre Başarıyla Sıfırlandı</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Merhaba,</p>
    <p>Şifrenizin başarıyla sıfırlandığını onaylamak için bu e-postayı gönderiyoruz.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Eğer bu şifre sıfırlama işlemini siz başlatmadıysanız, lütfen hemen destek ekibimizle iletişime geçin.</p>
    <p>Güvenliğiniz için şunları öneririz:</p>
    <ul>
      <li>Güçlü ve benzersiz bir şifre kullanın</li>
      <li>Varsa iki faktörlü kimlik doğrulamayı etkinleştirin</li>
      <li>Aynı şifreyi birden fazla sitede kullanmaktan kaçının</li>
    </ul>
    <p>Hesabınızı güvende tuttuğunuz için teşekkür ederiz.</p>
    <p>Saygılarımızla,<br>Uygulama Ekibiniz</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Bu otomatik bir mesajdır, lütfen yanıtlamayınız.</p>
  </div>
</body>
</html>
`;

// Şifre sıfırlama talebi için gönderilen e-posta şablonu
export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifrenizi Sıfırlayın</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Şifre Sıfırlama</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Merhaba,</p>
    <p>Şifrenizi sıfırlamak için bir talep aldık. Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Şifreyi Sıfırla</a>
    </div>
    <p>Güvenlik nedeniyle bu bağlantı 1 saat sonra geçersiz olacaktır.</p>
    <p>Saygılarımızla,<br>Uygulama Ekibiniz</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Bu otomatik bir mesajdır, lütfen yanıtlamayınız.</p>
  </div>
</body>
</html>
`;
