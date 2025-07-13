import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Çerez (cookie) gönderimini aktif ediyoruz (tarayıcı ile oturum bilgisi paylaşımı için)
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  // Başlangıç state'leri (initial states)
  user: null, // Giriş yapan kullanıcı bilgisi
  isAuthenticated: false, // Kullanıcının giriş yapıp yapmadığını belirten durum
  error: null, // Oluşan hata mesajı (varsa)
  isLoading: false, // Asenkron işlem sırasında yüklenme durumu
  isCheckingAuth: true, // Sayfa yüklendiğinde auth kontrolü yapılırken true olur
  message: null, // Bilgi mesajları (şifre sıfırlandı, e-posta gönderildi vb.)

  // Kullanıcı kayıt olma işlemi
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null }); // İşlem başlarken loading durumu ayarlanıyor
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      // Başarılı olursa kullanıcı state'i güncelleniyor
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // Hata durumunda mesaj set ediliyor
      set({ error: error.response.data.message || "Kaydolurken hata oluştu", isLoading: false });
      throw error;
    }
  },

  // Kullanıcı giriş işlemi
  login: async (email, password) => {
    set({ isLoading: true, error: null }); // İşlem başlarken loading ayarlanıyor
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      // Başarılı giriş sonrası user ve auth state'leri güncelleniyor
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      // Hata mesajı işleniyor
      set({ error: error.response?.data?.message || "Giriş yaparken hata oluştu", isLoading: false });
      throw error;
    }
  },

  // Kullanıcı çıkış işlemi
  logout: async () => {
    set({ isLoading: true, error: null }); // Çıkış işlemi başlatılırken
    try {
      await axios.post(`${API_URL}/logout`);
      // Çıkış sonrası user ve auth bilgileri sıfırlanır
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Çıkış yaparken hata oluştu", isLoading: false });
      throw error;
    }
  },

  // E-posta doğrulama işlemi
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null }); // Kod gönderilirken loading aktif
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      // Başarılı olursa kullanıcı doğrulanır
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      // Hata mesajı ayarlanır
      set({ error: error.response.data.message || "E-posta doğrulama hatası", isLoading: false });
      throw error;
    }
  },

  // Sayfa yüklendiğinde kullanıcının giriş durumu kontrol edilir
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null }); // Başlangıçta kontrol başlar
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      // Giriş yapılmışsa kullanıcı bilgisi çekilir
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      // Hata olursa kullanıcı çıkış yapmış sayılır
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  // Şifremi unuttum işlemi
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null }); // Mail gönderilirken loading başlar
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      // Başarılıysa bilgi mesajı set edilir
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      // Hata durumunda mesaj verilir
      set({
        isLoading: false,
        error: error.response.data.message || "Şifre sıfırlama e-postası gönderilirken hata oluştu",
      });
      throw error;
    }
  },

  // Şifre sıfırlama işlemi
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null }); // Sıfırlama başlarken
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      // Başarılıysa bilgi mesajı set edilir
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      // Hata mesajı set edilir
      set({
        isLoading: false,
        error: error.response.data.message || "Şifre sıfırlama hatası",
      });
      throw error;
    }
  },
}));
