import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// MailtrapClient nesnesini oluştururuz
export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT,
});

// Gönderen (sender) bilgisini tanımlarız
// email: Gönderenin e-posta adresi
// name: Gönderenin adı
export const sender = {
  email: "hello@demomailtrap.co",
  name: "Alper",
};

/*
// Örnek alıcılar dizisi (birden fazla kişiye e-posta göndermek için kullanılabilir)
const recipients = [
  {
    email: "alperbilgin200@gmail.com",
  },
];

// Mailtrap ile test e-postası göndermek için örnek kullanım
client
  .send({
    from: sender, // Gönderen bilgisi
    to: recipients, // Alıcı(lar) bilgisi
    subject: "You are awesome!", // E-posta başlığı
    text: "<p>Congrats for sending test email with Mailtrap!</p>", // E-posta içeriği (HTML olabilir)
    category: "Integration Test", // E-posta kategorisi (isteğe bağlı)
  })
  .then(console.log, console.error); // Sonuç veya hata konsola yazdırılır
*/
