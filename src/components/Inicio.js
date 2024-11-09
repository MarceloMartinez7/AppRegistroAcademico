import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MostrarEstudiantes from './MostrarEstudiantes';

const Inicio = () => {

    return (
        <View style={styles.container}>
          <MostrarEstudiantes/>
          </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        height: '100%', 
        width: '100%',
        marginTop: 50,
      },
    });

  export default Inicio;