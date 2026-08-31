import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import {colorGlobal} from '../utils/GlobalStyles';

export default function RechargeModal({
  onPressCancel,
  onPressRecharge,
  onRequestClose,
  visible,
}) {
  return (
    // <View >
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Low Balance</Text>
          <Text style={styles.modalMessage}>
            Your available wallet balance is low. Please recharge to proceed.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={onPressCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={onPressRecharge}>
              <Text style={styles.modalButtonText}>Recharge Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    // </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: colorGlobal.themeColor,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
