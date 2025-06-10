import Root from './helper/Root';
import { StyleSheet, View } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Loader from './helper/loader';
import { responsive } from './helper/responsive';

function Client() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_700Bold,
    'primary_font': require('./assets/fonts/WorkSans-Regular.ttf')
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  } 
  return <Root />;
}

export default Client;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20 * responsive(), 
    marginVertical: 40,
  },
  box: {
    width: '90%',
    height: 20,
    marginVertical: 5,
  },
});
