import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FadeLoading } from "react-native-fade-loading";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
const ServiceLoader = () => {
  return (
    <View style={styles.container}>
      {/* Service Cards */}
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.card}>
          <FadeLoading 
            style={styles.image} 
            primaryColor="#eee" 
            secondaryColor="#ddd" 
          />
          <View style={styles.textContainer}>
            <FadeLoading 
              style={styles.title} 
              primaryColor="#eee" 
              secondaryColor="#ddd" 
            />
            <FadeLoading 
              style={styles.subtitle} 
              primaryColor="#eee" 
              secondaryColor="#ddd" 
            />
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0cfa3',
    borderRadius: 10,
    padding: 7,
    paddingHorizontal: 30,
    marginBottom: hp('1.5%'),
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: wp('5%'),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    width: '60%',
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitle: {
    width: '40%',
    height: 14,
    borderRadius: 4,
  },
});
export default ServiceLoader;
