import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'YOUR_API_KEY'; 
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`${BASE_URL}/${baseCurrency}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const rates = await fetchExchangeRates(fromCurrency);
    const rate = rates.rates[toCurrency];
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

export const saveFavoriteCurrency = async (currency) => {
  try {
    const favorites = await getFavoriteCurrencies();
    if (!favorites.includes(currency)) {
      favorites.push(currency);
      await AsyncStorage.setItem('favoriteCurrencies', JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error saving favorite currency:', error);
    throw error;
  }
};

export const getFavoriteCurrencies = async () => {
  try {
    const favorites = await AsyncStorage.getItem('favoriteCurrencies');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorite currencies:', error);
    return [];
  }
};

export const removeFavoriteCurrency = async (currency) => {
  try {
    const favorites = await getFavoriteCurrencies();
    const updatedFavorites = favorites.filter(fav => fav !== currency);
    await AsyncStorage.setItem('favoriteCurrencies', JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite currency:', error);
    throw error;
  }
}; 