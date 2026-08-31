import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import {scale} from 'react-native-size-matters';
import CustomModal from '../../components/modals/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import api from '../../utils/api';
import CreateTicketModal from '../../components/modals/CreateTicketModal';

export default function Wallet() {
  const [isVisible, setIsVisible] = useState(false);
  const [wallet, setWallet] = useState(50000);
  const [addAmount, setWalletAmount] = useState('');
  const [walletAmount, setWalletAmounts] = useState(null);
  const [newAmounts, setNewAmount] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [walletApi, setWalletApi] = useState([]);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  // console.log(wallet);

  const toggleTransaction = item => {
    setSelectedTransactions(prev => {
      const exists = prev.includes(item._id);

      if (exists) {
        return prev.filter(id => id !== item._id);
      } else {
        return [...prev, item._id]; // ✅ store only ID
      }
    });
  };

  const submitSelectedTransactions = () => {
    if (selectedTransactions.length === 0) {
      alert('Please select at least one transaction');
      return;
    }

    setModalVisible(true);
  };

  // api post
  const addWalletHandler = async () => {
    console.log('calAmount', typeof walletAmount);
    console.log('addAmount', typeof Number(addAmount));
    const userId = await AsyncStorage.getItem('userId');

    try {
      if (walletAmount > Number(addAmount)) {
        setError('');
        const remainingAmount = Number(walletAmount) - Number(addAmount);
        console.log('add ', addAmount);

        const amountObj = {
          amount: addAmount.toString(),
          doctorId: userId,
          // paymentType: 'debited',
        };
        console.log('apiPOSt', amountObj);
        const response = await api.post(`docWalHistory/walletAdd`, amountObj);
        console.log('response api ', response?.data);

        await AsyncStorage.setItem(
          'lastUpdate',
          response.data.Wallet.createdAt.slice(0, 10),
        );
        await AsyncStorage.setItem(
          'remainingAmount',
          JSON.stringify(remainingAmount),
        );
        const lastUpdated = await AsyncStorage.getItem('lastUpdate');
        console.log('remaining', remainingAmount);

        // setWalletAmounts(remainingAmount);
        setNewAmount(response.data.Wallet.addAmount);
        setLastUpdate(lastUpdated);
        setIsVisible(false);
        setError(null);
      } else {
        console.log('insufficient Amount!!!');
        setError('insufficient Amount!!!');
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  //get Api
  const addWalletHandlerView = async () => {
    const response = await api.get(`docWalHistory/walletView`);
    console.log('get api', response.data.Wallet);

    setWalletAmounts(response.data.Wallet[0]?.totalamount); // static
    setWalletApi(response.data.Wallet);
    // setIsVisible(false);
  };

  async function getAmount() {
    const amount = await AsyncStorage.getItem('amount');
    setWallet(amount);
  }

  useEffect(() => {
    addWalletHandlerView();
    getAmount();
    if (isFocused) {
      getAmount();
    }
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.innerFirstContainer}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 0,
              marginLeft: 20,
              resizeMode: 'contain',
            }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/8206/8206167.png',
            }}
          />

          <Text style={{marginLeft: 20, color: '#fff', fontSize: scale(14)}}>
            Wallet
          </Text>
        </View>
        <Text style={styles.amountText}>
          ₹ {walletAmount ? walletAmount : wallet}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsVisible(true);
          }}>
          <Text style={styles.detailsText}>Withdrawal (PressMe)</Text>
        </TouchableOpacity>
        <Text style={styles.detailsText}>
          last Updated on {lastUpdate ? lastUpdate : '2024/07/02'}
        </Text>
      </View>
      <View style={styles.innerSecondContainer}>
        <View
          style={{
            marginVertical: scale(10),
            marginHorizontal: scale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            {/* <Text style={{fontSize: scale(12), color: 'green'}}>JUL</Text> */}
          </View>
          <View style={{flexDirection: 'row'}}>
            {/* <Text style={styles.amountHistoryText}> ₹ 22,000</Text> */}
            {/* <Text
              style={{
                color: colorGlobal.error,
                fontSize: scale(12),
                marginLeft: 10,
              }}>
              {' '}
              ₹ 2,000
            </Text> */}
            {/*  <Text
              style={{
                color: 'red',

                fontSize: scale(12),
              }}>
              {' '}
              - ₹ 500
            </Text> */}
          </View>
        </View>
        {selectedTransactions.length > 0 && (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submitSelectedTransactions}>
            <Text style={styles.submitBtnText}>
              Submit ({selectedTransactions.length})
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={walletApi.slice().reverse()}
          renderItem={({item}) => {
            const isSelected = selectedTransactions.includes(item._id);

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleTransaction(item)}
                style={[
                  styles.transactionItem,
                  isSelected && styles.selectedItem,
                ]}>
                <View style={{paddingVertical: scale(10)}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={styles.imageView}>
                      <Image
                        style={{width: 50, height: 50}}
                        source={{
                          uri: 'https://cdn-icons-png.flaticon.com/512/3090/3090181.png',
                        }}
                      />
                      <View style={{marginLeft: scale(10)}}>
                        <Text style={styles.amountTitleHistory}>
                          {item.status}
                        </Text>
                        <Text style={styles.bottomDetailsText}>{item._id}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        marginRight: scale(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.amountHistoryTextR}>
                        ₹ {item.finalAmount}
                      </Text>
                      <Text style={styles.bottomDetailsText}>
                        {item.createdAt.slice(0, 10)}
                      </Text>
                    </View>
                  </View>
                  <View style={globalStyles.spaceLine} />
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <CustomModal
          onPress={addWalletHandler}
          onPressReturn={() => {
            setIsVisible(false);
          }}
          visible={isVisible}
          error={error}
          cancelOnPress={() => {
            setIsVisible(false);
          }}
          onChangeText={txt => {
            setWalletAmount(txt);
          }}
        />
      </View>
      <CreateTicketModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        orderId={selectedTransactions[0] || null}
        orderIdarra={selectedTransactions}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 5,
  },
  innerFirstContainer: {
    justifyContent: 'center',
    flex: 2,
    backgroundColor: '#6EABF1',
    elevation: 2,
  },
  innerSecondContainer: {
    flex: 3,
  },
  imageView: {
    flexDirection: 'row',
    marginLeft: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    color: colorGlobal.white,
    fontSize: scale(24),
    fontWeight: '600',
    marginTop: scale(10),
    marginLeft: '25%',
  },
  detailsText: {
    marginTop: 10,
    marginLeft: '25%',
    fontSize: scale(12),
    fontWeight: '500',
    color: '#fff',
  },
  bottomDetailsText: {
    color: colorGlobal.gray,
    fontSize: scale(12),
  },
  amountHistoryText: {
    color: 'green',
    fontSize: scale(12),
  },
  amountTitleHistory: {
    fontSize: scale(16),
    color: colorGlobal.black,
    fontWeight: '700',
  },
  amountHistoryTextR: {
    color: colorGlobal.error,
    fontSize: scale(12),
  },
  transactionItem: {
    backgroundColor: '#fff',
  },

  selectedItem: {
    backgroundColor: '#E8F1FF',
    borderLeftWidth: 4,
    borderLeftColor: '#6EABF1',
  },

  submitBtn: {
    backgroundColor: '#5083be',
    paddingVertical: scale(12),
    marginHorizontal: 20,
    margin: scale(20),
    borderRadius: 8,
    alignItems: 'center',
  },

  submitBtnText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: '700',
  },
});
