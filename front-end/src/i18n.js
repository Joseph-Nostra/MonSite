import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "welcome": "Bienvenue sur MonSite",
      "shop_now": "Voir les produits",
      "cart": "Panier",
      "my_orders": "Mes commandes",
      "favorites": "Favoris",
      "simulator": "Simulateur PC",
      "dark_mode": "Mode Sombre"
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to MonSite",
      "shop_now": "Shop Now",
      "cart": "Cart",
      "my_orders": "My Orders",
      "favorites": "Favorites",
      "simulator": "PC Simulator",
      "dark_mode": "Dark Mode"
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بكم في موقعي",
      "shop_now": "تسوق الآن",
      "cart": "السلة",
      "my_orders": "طلباتي",
      "favorites": "المفضلة",
      "simulator": "محاكي الكمبيوتر",
      "dark_mode": "الوضع الليلي"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
