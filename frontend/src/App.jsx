import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
// Sayfa bileşenleri
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// Kimlik doğrulaması gerektiren route'ları için
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore(); // Kimlik doğrulama durumu ve kullanıcı bilgisi

  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Giriş yapılmış ama e-posta doğrulanmamışsa doğrulama sayfasına yönlendir
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Tüm koşullar sağlanıyorsa içeriği (children) göster
  return children;
};

// Giriş yapmış kullanıcıları ana sayfaya yönlendiren özel bileşen
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Giriş yapılmış ve e-posta doğrulanmışsa dashboard'a yönlendir
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  // Aksi durumda bileşeni göster (örneğin: login ya da signup sayfası)
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore(); // Giriş kontrol durumu ve kontrol fonksiyonu

  useEffect(() => {
    checkAuth(); // Uygulama yüklendiğinde kullanıcı doğrulamasını kontrol et
  }, [checkAuth]);

  // Giriş durumu kontrol ediliyorsa yüklenme ekranı göster
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      {/* Sayfa rotaları */}
      <Routes>
        {/* Ana sayfa - sadece doğrulanmış kullanıcılar erişebilir */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Kayıt sayfası - giriş yapılmamış kullanıcılar erişebilir */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Giriş sayfası - giriş yapılmamış kullanıcılar erişebilir */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* E-posta doğrulama sayfası */}
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        {/* Şifre sıfırlama isteği sayfası */}
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Şifre sıfırlama sayfası (token ile) */}
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Tanımlı olmayan tüm rotalar için ana sayfaya yönlendirme */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
