import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {scale, vs} from 'react-native-size-matters';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateTicketModal from '../../components/modals/CreateTicketModal';

export default function Report() {
  const navigation = useNavigation();
  const isfocused = useIsFocused();

  const buttons = [
    {label: 'Pending', key: 'Pending'},
    {label: 'History', key: 'Completed'},
    {label: 'Cancelled', key: 'Cancelled'},
  ];
  const [data, setData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSelect = report => {
    const exists = selectedReports.includes(report._id);

    if (exists) {
      setSelectedReports(prev => prev.filter(id => id !== report._id));
    } else {
      setSelectedReports(prev => [...prev, report._id]);
    }
  };

  // const filterData = () => {
  //   return data.filter(item => item.status === status);
  // };

  const testReports = async () => {
    const doctorId = await AsyncStorage.getItem('userId');

    try {
      const response = await api.get(`/testReport/view-by-doctor/${doctorId}`);
      setData(response?.data?.prescription);
    } catch (error) {}
  };
  useEffect(() => {
    if (isfocused) {
      testReports();
    }
  }, [isfocused]);

  // share to all
  const onShare = async image => {
    try {
      const result = await Share.share({
        message: 'Would You Like To Share...',
        url: image,
      });
      if (result.action === Share.sharedAction) {
        // console.log('Shared with activity type: ', result.activityType);
        if (result.activityType) {
          // shared with activity type of result.activityType
          // console.log('Shared with activity type: ', result.activityType);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <View
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
      </View> */}
      <Text
        style={[styles.actionText, {textAlign: 'center', paddingVertical: 10}]}>
        Note: If you have any issue select any report to create ticket
      </Text>
      {selectedReports.length > 0 && (
        <View style={styles.selectionActions}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSelectedReports([])}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={item => item._id}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({item}) => (
          <View style={styles.card}>
            {/* Header */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => toggleSelect(item)}>
              <View
                style={[
                  styles.checkbox,
                  selectedReports.includes(item._id) && styles.checkedBox,
                ]}
              />
              <Text style={styles.selectText}>Select</Text>
            </TouchableOpacity>

            <View style={styles.cardHeader}>
              <Text style={styles.patientName}>
                {item?.patientId?.fullname}
              </Text>
              <Text style={styles.dateText}>
                {item?.date} | {item?.time}
              </Text>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <Text style={styles.label}>Lab Tests:</Text>
              <Text style={styles.value}>{item?.labTest?.join(', ')}</Text>

              <Text style={styles.label}>Priority:</Text>
              <Text style={[styles.value, {color: '#d9534f'}]}>
                {item?.priority}
              </Text>

              <Text style={styles.label}>Course:</Text>
              <Text style={styles.value}>{item?.course}</Text>

              {item?.other ? (
                <>
                  <Text style={styles.label}>Notes:</Text>
                  <Text style={styles.value}>{item?.other}</Text>
                </>
              ) : null}
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ReportDetail', {reportId: item})
                }
                style={styles.actionButton}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/download.png')}
                />
                <Text style={styles.actionText}>PDF</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => onShare(item._id)}
                style={styles.actionButton}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/shareEvery.png')}
                />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        )}
      />
      {selectedReports ? (
        <TouchableOpacity
          style={styles.createTicketButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.createTicketText}>
            Select Report
            {/* Select Item ({selectedReports.length}) */}
          </Text>
        </TouchableOpacity>
      ) : null}
      <CreateTicketModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        orderId={selectedReports[0] || null}
        orderIdarra={selectedReports}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colorGlobal.lightWhite},
  navigation: {
    paddingVertical: 8,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colorGlobal.lightWhite,
  },

  listView: {
    width: '95%',
    borderRadius: 5,
    marginVertical: 4,
    backgroundColor: colorGlobal.white,
    alignSelf: 'center',
    elevation: 1,
    padding: 10,
  },

  textNameList: {
    fontSize: scale(16),
    fontWeight: '700',
    color: colorGlobal.black,
    marginTop: 5,
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
  imageView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: vs(20),
    alignItems: 'center',
  },
  image: {
    width: 32,
    height: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  dateText: {
    fontSize: 12,
    color: '#888',
  },

  cardBody: {
    marginTop: 5,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 6,
  },

  value: {
    fontSize: 14,
    color: '#666',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colorGlobal.themeColor,
  },

  createTicketButton: {
    backgroundColor: colorGlobal.themeColor,
    padding: 15,
    margin: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  createTicketText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colorGlobal.themeColor,
    borderRadius: 4,
    marginRight: 10,
  },

  checkedBox: {
    backgroundColor: colorGlobal.themeColor,
  },

  selectText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    alignItems: 'center',
  },

  clearText: {
    color: '#a74141',
    fontWeight: '800',
    fontSize: 16,
  },
});
