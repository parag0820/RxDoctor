import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {scale, verticalScale, vs} from 'react-native-size-matters';
import {colorGlobal} from '../../utils/globalStyls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

export default function OrderHistory() {
  const navigation = useNavigation();
  const [medicineData, setMedicineData] = useState([]); // Medicine orders
  const [diagnosticData, setDiagnosticData] = useState([]); // Diagnostic orders
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [status, setStatus] = useState('medicine'); // Track selected tab

  const getShortStatus = status => {
    const statusMap = {
      Pending: 'Pending',
      'Out of Delivery': 'Out of Delivery',
      Accept: 'Accept',
      Delivery: 'Delivery',
      Cancelled: 'Cancelled',
      'Pick Order': 'Pick Order',
    };
    return statusMap[status] || status; // Default to original status if not found
  };

  const getStatusColor = status => {
    const colorMap = {
      Pending: 'orange',
      'Out of Delivery': 'blue',
      Accept: 'green',
      Delivery: 'purple',
      Cancelled: 'red',
      'Pick Order': 'plum',
    };
    return colorMap[status] || 'black'; // Default color if not found
  };

  const buttons = [
    {label: 'Medicine', key: 'medicine'},
    {label: 'Diagnostic', key: 'diagnostic'},
  ];

  const fetchMedicineData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const response = await api.get(
        `/pharmaEarning/view-by-patient/${userId}`,
      );
      console.log('Medicine ', response.data.earning);

      setMedicineData(response.data.earning || []);
    } catch (error) {
      console.error('Error fetching medicine data:', error);
    }
  };

  const fetchDiagnosticData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(
        `diagnosticEarning/earning-viewByPatient/${userId}`,
      );
      console.log('respoinseOrderDiagnostic', response?.data?.data);
      setDiagnosticData(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const reloadData = async () => {
    setRefreshing(true);
    await fetchMedicineData();
    await fetchDiagnosticData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      reloadData();
    }
  }, [isFocused]);

  const renderItemMedicine = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.text}>Order ID: {item.orderId}</Text>
      <Text style={styles.text}>Mobile Number: {item.mobileNumber}</Text>
      <Text style={styles.text}>Advance Payment: {item.advanceAmount}</Text>
      <Text style={styles.text}>Order Cost: ₹{item.orderCost.toFixed(2)}</Text>
      <Text style={styles.text}>
        Remaining Amount: ₹
        {Number(item.orderCost.toFixed(2)) -
          Number(item.advanceAmount.toFixed(2))}
      </Text>
      <Text style={styles.text}>
        Status:{' '}
        <Text style={[styles.text, {color: getStatusColor(item.status)}]}>
          {getShortStatus(item.status)}
        </Text>
      </Text>
    </View>
  );
  const renderItemDiagnostic = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.text}>Order ID: {item?._id}</Text>
      <Text style={styles.text}>Center Name: {item?.centerName}</Text>
      <Text style={styles.text}>Mobile Number: {item.mobileNumber}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Time: {item.time}</Text>
      <Text style={styles.text}>Advance Payment: ₹{item.advanceAmount}</Text>
      <Text style={styles.text}>Order Cost: ₹{item.orderCost}</Text>
      <Text style={styles.text}>
        Remaining Amount: ₹
        {Number(item.orderCost.toFixed(2)) -
          Number(item.advanceAmount.toFixed(2))}
      </Text>
      <Text style={styles.text}>
        Status:{' '}
        <Text style={[styles.text, {color: getStatusColor(item.status)}]}>
          {getShortStatus(item.status)}
        </Text>
      </Text>
    </View>
  );

  const getRenderItem = () => {
    return status === 'medicine' ? renderItemMedicine : renderItemDiagnostic;
  };

  const getData = () => {
    return status === 'medicine' ? medicineData : diagnosticData;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: vs(10),
        }}>
        {buttons.map(button => (
          <TouchableOpacity
            key={button.key}
            activeOpacity={0.9}
            onPress={() => setStatus(button.key)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: vs(35),
              width: scale(95),
              backgroundColor:
                status === button.key ? colorGlobal.themeColor : 'white',
              borderRadius: 30,
              borderWidth: 1.5,
              borderColor: colorGlobal.themeColor,
            }}>
            <Text
              style={{
                fontSize: scale(14),
                color:
                  status === button.key ? colorGlobal.white : colorGlobal.black,
                fontWeight: '600',
              }}>
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getData()}
        renderItem={getRenderItem()}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadData} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorGlobal.lightWhite,
  },

  containerDig: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: verticalScale(3),
    height: verticalScale(170),
    width: '95%',
    alignSelf: 'center',
  },

  MainView: {
    height: verticalScale(128),
    width: scale(300),
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
  },

  ImageView: {
    height: verticalScale(100),
    width: scale(80),
    borderRadius: 10,
    margin: scale(10),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(-5),
  },

  DignosistTextView: {
    marginLeft: scale(105),
    marginTop: verticalScale(10),
    flexDirection: 'column',
  },

  DrText: {
    fontSize: scale(16),
    color: 'black',
    fontWeight: '700',
  },

  DignosistText: {
    fontSize: scale(14),
    color: 'black',
    fontWeight: '600',
    marginTop: verticalScale(5),
  },

  textList: {
    fontSize: scale(14),
    fontWeight: '500',
    color: colorGlobal.gray,
    marginLeft: scale(10),
    marginTop: 5,
  },

  button: {
    height: 40,
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(5),
  },

  buttonText: {
    fontSize: scale(14),
    color: 'white',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
    fontWeight: '500',
  },
});
