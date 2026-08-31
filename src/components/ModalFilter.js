import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {scale} from 'react-native-size-matters';
import GlobalStyles, {colorGlobal} from '../utils/GlobalStyles';

export default function ModalFilter({
  visible,
  onRequestClose,
  animationType,
  title,
  onPressCancel,
  onPressN,
  onPressB,
  onPressT,
  onPressR,
  image,
  name,
  btotop,
  ttob,
  rating,
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
            <View style={styles.innerFilterContainer}>
              <View style={styles.filterRightView}>
                <Image
                  style={styles.imageFilter}
                  source={require('../assets/filter.png')}
                />
                <Text style={GlobalStyles.inputHeading}>{title}</Text>
              </View>
              <TouchableOpacity onPress={onPressCancel}>
                <Image
                  style={styles.imageFilter}
                  source={require('../assets/clear.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.removeView}>
              <TouchableOpacity style={styles.space} onPress={onPressN}>
                <Text style={styles.removeText}>{name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.space} onPress={onPressB}>
                <Text style={styles.removeText}>{btotop}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.space} onPress={onPressT}>
                <Text style={styles.removeText}>{ttob}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.space} onPress={onPressR}>
                <Text style={styles.removeText}>{rating}</Text>
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
    justifyContent: 'flex-end',
  },
  innerContainer: {
    width: '100%',
    backgroundColor: colorGlobal.white,
    borderRadius: 10,
    elevation: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  innerFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterRightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeView: {
    justifyContent: 'center',
    marginVertical: 10,
  },
  image: {
    width: 24,
    height: 24,
    tintColor: 'red',
    marginRight: 5,
  },
  imageFilter: {width: 24, height: 24, marginRight: 10},
  space: {
    marginVertical: 15,
    marginLeft: scale(10),
  },
  removeText: {
    fontSize: scale(16),
    fontWeight: '400',
    textAlign: 'left',
    color: colorGlobal.black,
  },
});
