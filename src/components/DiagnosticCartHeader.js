import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DiagnosticHeader({title}) {
  const navigation = useNavigation();
  const cartQty = Number(useSelector(state => state.doctor.cartQty)) || 0;
  console.log('User Carty Qty', cartQty);

  const goToCart = async () => {
    const centerId = await AsyncStorage.getItem('centerId');
    navigation.navigate('DiagnoisticAddToCart', {centerId});
  };

  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View style={styles.left}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* RIGHT */}
      <TouchableOpacity onPress={goToCart} style={styles.cartContainer}>
        {cartQty >= 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartQty}</Text>
          </View>
        )}
        <Ionicons name="cart-outline" size={26} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    elevation: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBtn: {
    padding: 6,
  },
  title: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flexShrink: 1,
  },
  cartContainer: {
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
