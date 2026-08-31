import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import Input from '../../components/Input';
import {scale} from 'react-native-size-matters';
import {colorGlobal} from '../../utils/globalStyls';
export default function CustomModal({
  visible,
  onRequestClose,
  onPress,
  onChangeText,
  value,
  error,
  onPressReturn,
}) {
  return (
    <View style={styles.root}>
      <Modal
        visible={visible}
        onRequestClose={onRequestClose}
        transparent={true}
        animationType="slide">
        <View style={styles.modalWrapper}>
          <View style={styles.container}>
            {/* <Text style={{color: '#000', alignSelf: 'flex-end'}}>x</Text> */}
            <Text
              style={[
                {
                  marginBottom: scale(20),
                  fontSize: 16,
                  color: 'black',
                  fontWeight: '700',
                },
              ]}>
              Enter Amount
            </Text>
            <Input
              placeholder={'Your Amount'}
              onChangeText={onChangeText}
              keyboardType={'numeric'}
              value={value}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={onPressReturn}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={onPress}>
                <Text style={styles.modalButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: 300,
    height: 200,
    borderRadius: 10,
    backgroundColor: colorGlobal.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  modalButtons: {
    marginTop: 20,
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
