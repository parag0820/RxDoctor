import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TicketCard from '../../components/TicketCard';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const dummyTickets = [
  {
    id: '1',
    subject: 'Prescription issue',
    status: 'Open',
    date: '23-12-2025',
    title: 'Issue with prescription',
  },
  {
    id: '2',
    subject: 'Payment failed',
    status: 'Closed',
    date: '23-12-2025',
    title: 'Unable to process payment',
  },
];

export default function TicketList({navigation}) {
  const [tickets, setTickets] = useState([]);
  const getTickets = async () => {
    try {
      const doctorId = await AsyncStorage.getItem('userId');
      const response = await api.get(
        `/doctor-ticket/ticket-get-by-doctor/${doctorId}`,
      );
      console.log('Tickets:', response?.data?.data);
      setTickets(response?.data?.data);
    } catch (error) {
      console.log('Error fetching tickets:', error);
    }
  };
  useEffect(() => {
    getTickets();
  }, []);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Support Tickets</Text>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('CreateTicket')}>
          <Text style={styles.createBtnText}>+ New Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Ticket List */}
      <FlatList
        data={tickets}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({item}) => (
          <TicketCard
            ticket={item}
            onPress={() => navigation.navigate('TicketDetail', {ticket: item})}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No tickets created yet</Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },

  createBtn: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  createBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  emptyBox: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyText: {
    color: '#777',
    fontSize: 15,
  },
});
