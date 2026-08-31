import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, vs} from 'react-native-size-matters';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import CreateTicketModal from '../../components/modals/CreateTicketModal';

export default function Prescription() {
  const navigation = useNavigation();

  const [prescriptionList, setPrescriptionList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // ⭐ selected items

  /* ---------------- FETCH DATA ---------------- */
  const prescriptionHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/presFrom/view-by-doctor/${userId}`);
      setPrescriptionList(response.data.prescription || []);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- SELECT / UNSELECT ---------------- */
  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };
  const clearAll = () => {
    setSelectedIds([]);
  };

  /* ---------------- POST SELECTED ---------------- */
  const submitSelected = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Please select at least one item');
      return;
    }

    setModalVisible(true);
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderAppointmentItem = ({item}) => {
    const isSelected = selectedIds.includes(item._id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => toggleSelect(item._id)}
        style={[styles.listView, isSelected && styles.selectedCard]}>
        {/* Checkbox */}
        <View style={styles.checkboxRow}>
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          />
          <Text style={styles.selectText}>
            {isSelected ? 'Selected' : 'Tap to select'}
          </Text>
        </View>

        <Text style={styles.textNameList}>
          Prescribed by:
          <Text style={styles.textList}> Dr. {item.doctorName}</Text>
        </Text>

        <Text style={styles.textNameList}>
          Patient Name:
          <Text style={styles.textList}>{item.patientName}</Text>
        </Text>

        <Text style={styles.textNameList}>
          Dosage:
          <Text style={styles.textList}>{item?.prescDoctor?.[0]?.dosage}</Text>
        </Text>

        <Text style={styles.textNameList}>
          Duration:
          <Text style={styles.textList}>{item?.prescDoctor?.[0]?.course}</Text>
        </Text>

        <Text style={styles.textNameList}>
          Appointment Type:
          <Text style={styles.textList}>{item?.appointmentType}</Text>
        </Text>

        <View style={styles.imageView}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() =>
              navigation.navigate('PrescriptionDetail', {
                prescriptionId: item._id,
              })
            }>
            <Image
              style={globalStyles.image}
              source={require('../../assets/download.png')}
            />
            <Text style={styles.actionText}>PDF</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    prescriptionHandler();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.noteText}>Note: Tap to select for any issue</Text>

        <TouchableOpacity onPress={clearAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={prescriptionList}
        renderItem={renderAppointmentItem}
        keyExtractor={item => item._id}
      />

      {/* SUBMIT BUTTON */}
      <TouchableOpacity
        style={[styles.button, {opacity: selectedIds.length ? 1 : 0.5}]}
        onPress={submitSelected}
        disabled={!selectedIds.length}>
        <Text style={styles.buttonText}>
          Submit
          {/* ({selectedIds.length}) */}
        </Text>
      </TouchableOpacity>
      <CreateTicketModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        orderId={selectedIds[0] || null}
        orderIdarra={selectedIds}
      />
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorGlobal.lightWhite,
  },
  listView: {
    borderRadius: 10,
    margin: 8,
    backgroundColor: colorGlobal.white,
    elevation: 2,
    padding: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colorGlobal.themeColor,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: colorGlobal.themeColor,
  },
  selectText: {
    fontSize: scale(12),
    color: '#555',
  },
  textNameList: {
    fontSize: scale(15),
    fontWeight: '700',
    color: colorGlobal.black,
    marginTop: 4,
  },
  textList: {
    fontSize: scale(14),
    fontWeight: '500',
    color: colorGlobal.themeColor,
    marginLeft: 6,
  },
  imageView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: vs(10),
  },
  button: {
    height: 48,
    backgroundColor: colorGlobal.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '700',
  },
  // header
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    padding: 15,
    backgroundColor: '#fff',
  },
  noteText: {
    fontSize: scale(13),
    color: '#6d1616',
    fontWeight: '500',
  },
  clearText: {
    fontSize: scale(14),
    color: '#633e3e',
    fontWeight: '700',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colorGlobal.themeColor,
  },
});
