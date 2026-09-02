import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colorGlobal } from '../../utils/globalStyls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import BASE_URL from '../../utils/baseUrl';
import CreateTicketModal from '../../components/modals/CreateTicketModal';

export default function Appointment() {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState('Accept');
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  const appointmentList = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(
        `patientPanel-appointment/viewDocId/${userId}`,
      );
      setAppointmentData(response.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    appointmentList();
  }, []);

  const buttons = [
    { label: 'Upcoming', key: 'Accept' },
    { label: 'History', key: 'Completed' },
    { label: 'Cancelled', key: 'Reject' },
  ];

  const filterData = () => {
    return appointmentData.filter(item => item.status === selectedButton);
  };

  const toggleSelectAppointment = id => {
    setSelectedAppointments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const getAppointmentIcon = type => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('video')) return 'videocam';
    if (lowerType.includes('chat') || lowerType.includes('message'))
      return 'chatbubbles';
    return 'person'; // Default for Clinic/In-person
  };

  const AppointmentCard = ({ item, isSelected, selectedButton, toggleSelectAppointment, navigation }) => {
    const [imageError, setImageError] = useState(false);

    const statusBadgeStyle =
      item.status === 'Accept'
        ? styles.statusBadgeAccept
        : item.status === 'Reject'
          ? styles.statusBadgeReject
          : styles.statusBadgePending;

    const statusTextStyle =
      item.status === 'Accept'
        ? styles.statusTextAccept
        : item.status === 'Reject'
          ? styles.statusTextReject
          : styles.statusTextPending;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => navigation.navigate('MyAppointment', { id: item._id })}>
        {selectedButton === 'Completed' && (
          <TouchableOpacity
            onPress={() => toggleSelectAppointment(item._id)}
            style={styles.checkbox}>
            <Ionicons
              name={isSelected ? 'checkbox' : 'square-outline'}
              size={24}
              color={colorGlobal.themeColor}
            />
          </TouchableOpacity>
        )}

        <View style={styles.cardContent}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={
                !imageError &&
                item?.patientId?.image &&
                item.patientId.image !== 'undefined' &&
                item.patientId.image !== 'null' &&
                item.patientId.image.trim() !== ''
                  ? { uri: `${BASE_URL}Images/${item.patientId.image}` }
                  : require('../../assets/default_patient.png')
              }
              onError={() => setImageError(true)}
            />
            <View
              style={styles.typeIconBadge}>
              <Ionicons
                name={getAppointmentIcon(item.appointmentType)}
                size={12}
                color="#FFF"
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.patientName} numberOfLines={1}>
                {item.fullName}
              </Text>
              <View
                style={[styles.statusBadge, statusBadgeStyle]}>
                <Text style={[styles.statusBadgeText, statusTextStyle]}>
                  {item.status === 'Accept' ? 'Upcoming' : item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.typeText}>
              {item.appointmentType} Appointment
            </Text>

            <View style={styles.dateTimeRow}>
              <View style={styles.infoPill}>
                <AntDesign name="calendar" size={12} color="#666" />
                <Text style={styles.pillText}>{item.date}</Text>
              </View>
              <View style={styles.infoPill}>
                <AntDesign name="clockcircleo" size={12} color="#666" />
                <Text style={styles.pillText}>{item.time}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAppointmentItem = ({ item }) => {
    const isSelected = selectedAppointments.includes(item._id);
    return (
      <AppointmentCard 
        item={item} 
        isSelected={isSelected}
        selectedButton={selectedButton}
        toggleSelectAppointment={toggleSelectAppointment}
        navigation={navigation}
      />
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      {/* Premium Segmented Toggle */}
      <View style={styles.headerControl}>
        <View style={styles.segmentedControl}>
          {buttons.map(button => (
            <TouchableOpacity
              key={button.key}
              onPress={() => setSelectedButton(button.key)}
              style={[
                styles.tabButton,
                selectedButton === button.key && styles.activeTabButton,
              ]}>
              <Text
                style={[
                  styles.tabLabel,
                  selectedButton === button.key && styles.activeTabLabel,
                ]}>
                {button.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedButton === 'Completed' && (
        <View style={styles.selectionHeader}>
          <Text style={styles.selectionNote}>
            Tap cards to select for ticket creation
          </Text>
          <TouchableOpacity onPress={() => setSelectedAppointments([])}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={styles.listBackground}
        data={filterData()}
        renderItem={renderAppointmentItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No appointments found</Text>
        }
      />

      {selectedButton === 'Completed' && selectedAppointments.length > 0 && (
        <TouchableOpacity
          style={styles.floatingSubmit}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.submitText}>
            Raise Ticket ({selectedAppointments.length})
          </Text>
          <AntDesign name="arrowright" size={18} color="#FFF" />
        </TouchableOpacity>
      )}

      <CreateTicketModal
        visible={modalVisible}
        onClose={() => {
          setSelectedAppointments([]);
          setModalVisible(false);
        }}
        orderId={selectedAppointments[0] || null}
        orderIdarra={selectedAppointments}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colorGlobal.white },

  // Segmented Control
  headerControl: {
    backgroundColor: colorGlobal.themeColor,
    padding: 15,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 5,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFF',
    borderWidth: 0,
  },
  tabLabel: { fontSize: scale(12), fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' },
  activeTabLabel: { color: colorGlobal.themeColor },

  // Card UI
  listBackground: { backgroundColor: '#F4F7FA' },
  listContent: { padding: 15, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EBF0F3',
  },
  selectedCard: {
    borderColor: colorGlobal.themeColor,
    backgroundColor: '#F0F9FF',
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },

  imageWrapper: { position: 'relative' },
  image: { width: scale(65), height: scale(65), borderRadius: 12 },
  typeIconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    padding: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: colorGlobal.themeColor,
  },

  infoContainer: { flex: 1, marginLeft: 15 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: scale(15),
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
  },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusBadgeAccept: { backgroundColor: '#2E7D3215' },
  statusBadgeReject: { backgroundColor: '#D32F2F15' },
  statusBadgePending: { backgroundColor: '#F57C0015' },
  statusBadgeText: {
    fontSize: scale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusTextAccept: { color: '#2E7D32' },
  statusTextReject: { color: '#D32F2F' },
  statusTextPending: { color: '#F57C00' },

  typeText: { fontSize: scale(11), color: '#7F8C8D', marginVertical: 4 },

  dateTimeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    flexShrink: 1,
  },
  pillText: {
    fontSize: scale(11),
    color: '#4A5568',
    marginLeft: 5,
    fontWeight: '500',
    flexShrink: 1,
  },

  // Actions
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#F4F7FA',
  },
  selectionNote: { fontSize: scale(11), color: '#95A5A6', fontStyle: 'italic' },
  clearText: { color: '#E74C3C', fontWeight: '700' },
  checkbox: { position: 'absolute', right: 8, top: 8, zIndex: 10 },

  floatingSubmit: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: colorGlobal.themeColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    gap: 10,
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#BDC3C7' },
});
