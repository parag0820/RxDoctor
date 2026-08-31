import {colorGlobal} from '../../utils/globalStyls';
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import AddButton from '../../components/AddButton';
import {scale, verticalScale, vs, s} from 'react-native-size-matters';

export default function ModalCom({
  visible,
  onRequestClose,
  animationType,
  title,
  onPress,
  metaData,
  image,
  onPressYes,
  onPressNo,
}) {
  return (
    <View>
      <Modal
        transparent
        visible={visible}
        onRequestClose={onRequestClose}
        animationType={animationType}>
        <View style={styles.root}>
          <View style={styles.innerContainer}>
            <Text
              style={{
                fontSize: scale(22),
                color: 'red',
                fontWeight: '500',
                marginTop: verticalScale(5),
              }}>
              Cancel Appointment
            </Text>

            <View
              style={{
                width: scale(300),
                height: verticalScale(0.3),
                borderWidth: 0.3,
                marginTop: verticalScale(5),
              }}></View>

            <Text
              style={{
                fontSize: scale(14),
                textAlign: 'center',
                marginTop: verticalScale(5),
              }}>
              Are You Soure You Want to Cancle Your
              {'\n'} Appoinment?
            </Text>
            <Text>{title}</Text>
            <View style={styles.removeView}>
              <Text style={styles.removeText}>{metaData}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: verticalScale(10),
              }}>
              <AddButton
                color={colorGlobal.themeColor}
                onPress={onPressNo}
                title={'Cancle'}
              />

              <AddButton
                color={colorGlobal.themeColor}
                onPress={onPressYes}
                title={'Yes'}
              />
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  innerContainer: {
    height: 230,
    width: '100%',
    backgroundColor: colorGlobal.white,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 20,
  },
  removeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
    tintColor: 'red',
    marginRight: 5,
  },
  removeText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: 'red',
  },
  yesNo: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#fff',
    marginRight: 10,
    marginBottom: 20,
  },
});
