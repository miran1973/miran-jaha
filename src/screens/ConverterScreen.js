import React, { useState, useEffect } from 'react';
import { View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Dimensions,} from 'react-native';
import { currencies } from '../data/currencies';
import { convertCurrency } from '../services/currencyService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConverterScreen = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    convertCurrencies();
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrencies = async () => {
    if (!amount || isNaN(amount)) return;
    
    setLoading(true);
    try {
      const convertedAmount = await convertCurrency(
        parseFloat(amount),
        fromCurrency.code,
        toCurrency.code
      );
      setResult(convertedAmount.toFixed(2));
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => {
        if (showFromPicker) {
          setFromCurrency(item);
          setShowFromPicker(false);
        } else {
          setToCurrency(item);
          setShowToPicker(false);
        }
      }}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.currencyInfo}>
        <Text style={styles.currencyName}>{item.name}</Text>
        <Text style={styles.currencyCode}>{item.code}</Text>
      </View>
    </TouchableOpacity>
  );

  const closePicker = () => {
    setShowFromPicker(false);
    setShowToPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Currency Converter</Text>
      </View>

      <View style={styles.converterContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => setShowFromPicker(true)}
          >
            <Text style={styles.flag}>{fromCurrency.flag}</Text>
            <View style={styles.currencySelectorInfo}>
              <Text style={styles.currencySelectorCode}>{fromCurrency.code}</Text>
              <Text style={styles.currencySelectorName}>{fromCurrency.name}</Text>
            </View>
            <Icon name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.swapButtonContainer}>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => {
              const temp = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(temp);
            }}
          >
            <Icon name="swap-horiz" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Result</Text>
          <View style={styles.resultContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={styles.resultText}>
                {result ? `${result} ${toCurrency.code}` : '0.00'}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => setShowToPicker(true)}
          >
            <Text style={styles.flag}>{toCurrency.flag}</Text>
            <View style={styles.currencySelectorInfo}>
              <Text style={styles.currencySelectorCode}>{toCurrency.code}</Text>
              <Text style={styles.currencySelectorName}>{toCurrency.name}</Text>
            </View>
            <Icon name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showFromPicker || showToPicker}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closePicker}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {showFromPicker ? 'Select From Currency' : 'Select To Currency'}
              </Text>
              <TouchableOpacity onPress={closePicker}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currencies}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.currencyList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  converterContainer: {
    padding: 20,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    padding: 0,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  currencySelectorInfo: {
    flex: 1,
    marginLeft: 10,
  },
  currencySelectorCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  currencySelectorName: {
    fontSize: 14,
    color: '#666',
  },
  flag: {
    fontSize: 24,
    marginRight: 10,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  swapButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  resultContainer: {
    minHeight: 40,
    justifyContent: 'center',
    marginBottom: 15,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  currencyList: {
    paddingBottom: 20,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencyInfo: {
    flex: 1,
    marginLeft: 10,
  },
  currencyName: {
    fontSize: 16,
    color: '#333',
  },
  currencyCode: {
    fontSize: 14,
    color: '#666',
  },
});

export default ConverterScreen; 