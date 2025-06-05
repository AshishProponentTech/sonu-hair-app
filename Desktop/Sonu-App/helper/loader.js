import * as React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { FadeLoading } from "react-native-fade-loading";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

function Loader() {
  const isTablet = Dimensions.get('window').width >= 768;
  
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <FadeLoading 
            style={styles.menuIconPlaceholder}
            primaryColor="#ffedcb87"
            secondaryColor="#fff8ebbd"
          />
          <FadeLoading 
            style={styles.profileImagePlaceholder}
            primaryColor="#ffedcb87"
            secondaryColor="#fff8ebbd"
          />
        </View>
        
        <View style={styles.welcomeTextPlaceholder}>
          <FadeLoading 
            style={[styles.textPlaceholder, { width: wp('25%'), marginBottom: 10 }]}
            primaryColor="#ffffff50"
            secondaryColor="#ffffff30"
          />
          <FadeLoading 
            style={[styles.textPlaceholder, { width: wp('40%') }]}
            primaryColor="#ffffff50"
            secondaryColor="#ffffff30"
          />
        </View>
      </View>

      {/* Location Placeholder */}
      <View style={styles.locationContainer}>
        <FadeLoading 
          style={styles.locationPlaceholder}
          primaryColor="#f5f5f5"
          secondaryColor="#e0e0e0"
        />
      </View>

      {/* What's New Section */}
      <View style={styles.sectionContainer}>
        <FadeLoading 
          style={[styles.sectionTitle, { width: wp('30%') }]}
          primaryColor="#ffedcb87"
          secondaryColor="#fff8ebbd"
        />
        <FadeLoading 
          style={[styles.carouselPlaceholder, { height: isTablet ? hp('25%') : hp('20%') }]}
          primaryColor="#ffedcb87"
          secondaryColor="#fff8ebbd"
        />
      </View>

      {/* Top Services Section */}
      <View style={styles.sectionContainer}>
        <FadeLoading 
          style={[styles.sectionTitle, { width: wp('30%') }]}
          primaryColor="#ffedcb87"
          secondaryColor="#fff8ebbd"
        />
        <View style={styles.servicesContainer}>
          {[...Array(2)].map((_, i) => (
            <FadeLoading 
              key={`service-${i}`}
              style={styles.serviceCardPlaceholder}
              primaryColor="#ffedcb87"
              secondaryColor="#fff8ebbd"
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#D2AE6A', // Simulating gradient
    paddingTop: hp('2%'),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  menuIconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  welcomeTextPlaceholder: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  textPlaceholder: {
    height: 20,
    borderRadius: 4,
  },
  locationContainer: {
    marginHorizontal: wp('5%'),
    marginTop: -hp('2%'),
    marginBottom: hp('2%'),
  },
  locationPlaceholder: {
    width: '100%',
    height: 50,
    borderRadius: 8,
  },
  sectionContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    height: 24,
    borderRadius: 4,
    marginBottom: hp('2%'),
  },
  carouselPlaceholder: {
    width: '100%',
    borderRadius: 10,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCardPlaceholder: {
    width: '48%',
    height: hp('15%'),
    borderRadius: 10,
    marginBottom: hp('2%'),
  },
  stylistsContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  stylistCardPlaceholder: {
    width: wp('22%'),
    height: hp('12%'),
    borderRadius: 10,
    marginRight: wp('3%'),
  },
});

export default Loader;