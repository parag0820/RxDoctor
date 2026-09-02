import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {scale, verticalScale} from 'react-native-size-matters';
import api from '../../utils/api';
import Loader from '../../components/Loadder';
import {colorGlobal} from '../../utils/globalStyls';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useEffect, useState} from 'react';

export default function Notification() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointmentsList, setAppointmentList] = useState([]);
  const [allAppointmentsList, setAllAppointmentsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const allPatientRequest = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(
        `/docReqAppointment/viewByDoctor/${userId}`,
      );
      setAppointmentList(response.data.reqAppointment);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const appointmentListHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(
        `/patientPanel-appointment/viewDocId/${userId}`,
      );
      setAllAppointmentsList(response?.data?.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const requestAccept = async (acceptId, status) => {
    try {
      await api.put(`/docReqAppointment/updateReq/${acceptId}`, {status});
      allPatientRequest();
    } catch (error) {
      console.log(error);
    }
  };

  const appointmentBookingHandler = async (acceptId, status) => {
    try {
      await api.put(`/patientPanel-appointment/edit/${acceptId}`, {status});
      appointmentListHandler();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allPatientRequest();
    appointmentListHandler();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    allPatientRequest();
    appointmentListHandler();
  };

  const renderCard = ({item}) => {
    const isAppointment = activeTab === 'appointments';
    const statusStyle =
      item.status === 'Accept'
        ? styles.badgeAccept
        : item.status === 'Reject'
        ? styles.badgeReject
        : styles.badgePending;

    return (
      <View style={styles.card}>
        {/* Header: Icon and Status Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Ionicons
              name={isAppointment ? 'calendar' : 'person-add'}
              size={18}
              color={colorGlobal.themeColor}
            />
            <Text style={styles.headerTitle}>
              {isAppointment
                ? item.status === 'Accept'
                  ? 'Booked'
                  : 'Pending Request'
                : 'Patient Request'}
            </Text>
          </View>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>

        {/* Body: Patient Name and All Info */}
        <View style={styles.cardBody}>
          <Text style={styles.patientName}>{item.patientId.fullname}</Text>

          {/* Data Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{item.patientId.city}</Text>
            </View>

            {isAppointment ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{item.appointmentType}</Text>
              </View>
            ) : (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Mobile</Text>
                <Text style={styles.infoValue}>
                  {item.patientId.mobileNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Date and Time Row (Always visible for Appointments) */}
          {isAppointment && (
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Ionicons name="calendar-outline" size={14} color="#555" />
                <Text style={styles.dateTimeText}>{item.date}</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Ionicons name="time-outline" size={14} color="#555" />
                <Text style={styles.dateTimeText}>{item.time}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer: Action Buttons */}
        {item.status !== 'Accept' && item.status !== 'Reject' && (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={[styles.btn, styles.btnReject]}
              onPress={() =>
                isAppointment
                  ? appointmentBookingHandler(item._id, 'Reject')
                  : requestAccept(item._id, 'Reject')
              }>
              <Text style={styles.btnTextReject}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnAccept]}
              onPress={() =>
                isAppointment
                  ? appointmentBookingHandler(item._id, 'Accept')
                  : requestAccept(item._id, 'Accept')
              }>
              <Text style={styles.btnTextAccept}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Professional Segmented Control */}
      <View style={styles.toggleWrapper}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'appointments' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('appointments')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'appointments' && styles.activeTabText,
              ]}>
              Appointments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'requests' && styles.activeTabText,
              ]}>
              Patient Requests
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={
          activeTab === 'appointments'
            ? allAppointmentsList.slice().reverse()
            : appointmentsList.slice().reverse()
        }
        renderItem={renderCard}
        keyExtractor={item => item._id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No records found</Text>
        }
        contentContainerStyle={{paddingBottom: 20}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FB'},
  toggleWrapper: {backgroundColor: '#FFF', paddingBottom: 10, elevation: 2},
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: scale(15),
    marginTop: verticalScale(10),
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {backgroundColor: '#FFF', elevation: 2},
  tabText: {fontSize: scale(13), fontWeight: '600', color: '#888'},
  activeTabText: {color: colorGlobal.themeColor || '#2196F3'},

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    borderRadius: 12,
    padding: scale(15),
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center'},
  headerTitle: {
    fontSize: scale(11),
    color: '#888',
    marginLeft: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  statusBadge: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6},
  badgeAccept: {backgroundColor: '#E8F5E9'},
  badgeReject: {backgroundColor: '#FFEBEE'},
  badgePending: {backgroundColor: '#FFF3E0'},
  statusBadgeText: {fontSize: scale(10), fontWeight: 'bold', color: '#444'},

  cardBody: {marginBottom: 5},
  patientName: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },

  infoGrid: {flexDirection: 'row', marginBottom: 12},
  infoItem: {flex: 1},
  infoLabel: {
    fontSize: scale(10),
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {fontSize: scale(13), color: '#333', fontWeight: '500'},

  dateTimeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    gap: 20,
  },
  dateTimeItem: {flexDirection: 'row', alignItems: 'center'},
  dateTimeText: {
    fontSize: scale(12),
    color: '#555',
    marginLeft: 5,
    fontWeight: '500',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  btn: {
    flex: 0.48,
    height: verticalScale(35),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAccept: {backgroundColor: colorGlobal.themeColor || '#2196F3'},
  btnReject: {borderWidth: 1, borderColor: '#FF5252'},
  btnTextAccept: {color: '#FFF', fontWeight: '700'},
  btnTextReject: {color: '#FF5252', fontWeight: '700'},
  noDataText: {textAlign: 'center', marginTop: 40, color: '#999'},
});
