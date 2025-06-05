import * as React from 'react';
import Root from './helper/Root'
import { StyleSheet, View, Text, Image,Dimensions } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Loader from './helper/loader';
import { responsive } from './helper/responsive';






function Client({navigation}) {

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_700Bold,
    'primary_font': require('./assets/fonts/WorkSans-Regular.ttf')
  });





  //if (!fontsLoaded ) 
  if(false)
  {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    )
  } else {
    return (
      <>
     <Root />
           </>
      
    )
  }
}


// {
//   Inter_400Regular, Inter_700Bold, 'primary_font': ()=>{
//     if(true){ return require('./assets/fonts/WorkSans-Regular.ttf')}
//     if(false){ return require('./assets/fonts/WorkSans-Regular7.ttf')}
  
//     } 
//   }



export default Client;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20*responsive(),
    marginVertical: 40,
  },
  box: {
    width: '90%',
    height: 20,
    marginVertical: 5,
  },
});