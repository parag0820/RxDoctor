import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import {scale} from 'react-native-size-matters';
import {colorGlobal} from '../../utils/globalStyls';

export default function ProfileSetting({
  label,
  onPress,
  leftIcon,
  rightIcon,
  toggle,
}) {
  const [isOn, setIsOn] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* LEFT ICON + TEXT */}
      <View style={styles.leftContainer}>
        <Icon name={leftIcon} size={24} color={colorGlobal.black} />
        <Text style={styles.settingText}>{label}</Text>
      </View>

      {/* RIGHT ICON */}
      {rightIcon && (
        <Icon name={rightIcon} size={22} color={colorGlobal.gray} />
      )}

      {/* TOGGLE */}
      {toggle && (
        <ToggleSwitch
          isOn={isOn}
          onColor="#2ecc71"
          offColor="#ccc"
          size="small"
          onToggle={val => setIsOn(val)}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(12),
    marginHorizontal: scale(16),
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: scale(16),
    fontSize: scale(14),
    color: colorGlobal.black,
  },
});
