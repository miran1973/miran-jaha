import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { fetchExchangeRates, saveFavoriteCurrency, removeFavoriteCurrency } from '../services/currencyService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CurrencyDetailScreen = ({ route, navigation }) => {
  const { currency } = route.params;
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
 const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const data = await fetchExchangeRates(currency.code);
      setRates(data.rates);
    } catch (error) {
      console.error('Error loading rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteCurrency(currency.code);
      } else {
        await saveFavoriteCurrency(currency);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const renderRateItem = (code, rate) => (
    <View key={code} style={styles.rateItem}>
      <Text style={styles.rateCode}>{code}</Text>
      <Text style={styles.rateValue}>{rate.toFixed(4)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.flag}>{currency.flag}</Text>
          <Text style={styles.currencyName}>{currency.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Icon
            name={isFavorite ? 'star' : 'star-border'}
            size={24}
            color={isFavorite ? '#FFD700' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Currency Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Code:</Text>
            <Text style={styles.infoValue}>{currency.code}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Symbol:</Text>
            <Text style={styles.infoValue}>{currency.symbol}</Text>
          </View>
        </View>

        <View style={styles.ratesCard}>
          <Text style={styles.ratesTitle}>Exchange Rates</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <View style={styles.ratesList}>
              {Object.entries(rates || {}).map(([code, rate]) =>
                renderRateItem(code, rate)
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  currencyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteButton: {
    padding: 10,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  ratesCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ratesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ratesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rateItem: {
    width: '50%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rateCode: {
    fontSize: 14,
    color: '#666',
  },
  rateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default CurrencyDetailScreen;
