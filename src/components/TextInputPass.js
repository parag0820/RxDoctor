import {View, TextInput, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import GlobalStyles, {colorGlobal} from '../utils/GlobalStyles';
import globalStyls from '../utils/globalStyls';
// import globalStyles, {colorGlobal} from '../globalStyles';

export default function TextInputPass({
  placeholder,
  onChangeText,
  onBlur,
  value,
  maxLength,
}) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={globalStyls.inputPassView}>
      <TextInput
        style={{width: '85%', color: colorGlobal.black}}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        maxLength={maxLength}
        placeholderTextColor={'gray'}
        secureTextEntry={secure}
      />
      <TouchableOpacity
        onPress={() => {
          setSecure(!secure);
        }}>
        <Image
          style={GlobalStyles.image}
          source={
            secure
              ? require('../assets/show.png')
              : require('../assets/hide.png')
          }
        />
      </TouchableOpacity>
    </View>
  );
}
