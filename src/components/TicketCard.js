import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function TicketCard({ticket, onPress}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.subject}>{ticket?.ticketTitle}</Text>
      <Text style={styles.status}>
        Status:{' '}
        <Text style={{color: ticket.status === 'Open' ? '#388E3C' : '#FF5722'}}>
          {ticket.status}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  subject: {fontWeight: 'bold', fontSize: 16, color: '#000'},
  status: {marginTop: 5, color: '#555'},
});
