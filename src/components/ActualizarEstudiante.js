import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from '../database/firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const ActualizarEstudiante = () => {
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState('');
  const [asignaturas, setAsignaturas] = useState([{ asignatura: '', promedio: '' }]);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Recibe el ID del estudiante a actualizar

  useEffect(() => {
    cargarEstudiante();
  }, []);

  const cargarEstudiante = async () => {
    try {
      const docRef = doc(db, 'estudiantes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombre(data.nombre);
        setFoto(data.foto);
        setAsignaturas(data.asignaturas);
      } else {
        Alert.alert('Error', 'Estudiante no encontrado');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al cargar estudiante: ', error);
      Alert.alert('Error', 'No se pudo cargar el estudiante');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const actualizarEstudiante = async () => {
    if (!nombre || asignaturas.length === 0) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const estudianteData = {
        nombre,
        foto,
        asignaturas,
      };

      // Actualizar el estudiante en Firebase
      await updateDoc(doc(db, 'estudiantes', id), estudianteData);

      Alert.alert('Éxito', 'Estudiante actualizado exitosamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar estudiante: ', error);
      Alert.alert('Error', 'No se pudo actualizar el estudiante');
    }
  };

  const agregarAsignatura = () => {
    setAsignaturas([...asignaturas, { asignatura: '', promedio: '' }]);
  };

  const eliminarAsignatura = (index) => {
    setAsignaturas(asignaturas.filter((_, i) => i !== index));
  };

  const handleAsignaturaChange = (index, field, value) => {
    const updatedAsignaturas = asignaturas.map((asig, i) =>
      i === index ? { ...asig, [field]: value } : asig
    );
    setAsignaturas(updatedAsignaturas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Actualizar Estudiante</Text>
      <TextInput placeholder="Nombre" style={styles.input} onChangeText={setNombre} value={nombre} />

      <TouchableOpacity onPress={pickImage} style={styles.botonFoto}>
        <Text style={styles.textoBotonFoto}>{foto ? 'Cambiar Foto' : 'Seleccionar Foto'}</Text>
      </TouchableOpacity>

      <FlatList
        data={asignaturas}
        renderItem={({ item, index }) => (
          <View style={styles.asignaturaItem}>
            <TextInput
              placeholder="Asignatura"
              style={styles.inputSmall}
              onChangeText={(value) => handleAsignaturaChange(index, 'asignatura', value)}
              value={item.asignatura}
            />
            <TextInput
              placeholder="Promedio"
              style={styles.inputSmall}
              onChangeText={(value) => handleAsignaturaChange(index, 'promedio', value)}
              value={item.promedio}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => eliminarAsignatura(index)} style={styles.botonEliminar}>
              <Text style={styles.textoBotonEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity onPress={agregarAsignatura} style={styles.botonAgregar}>
        <Text style={styles.textoBotonAgregar}>Agregar Asignatura</Text>
      </TouchableOpacity>

      <Button title="Actualizar Estudiante" onPress={actualizarEstudiante} />
    </View>
  );
};

export default ActualizarEstudiante;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 16,
      backgroundColor: '#fff',
      marginBottom: 15,
    },
    botonFoto: {
      backgroundColor: '#007BFF',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 15,
    },
    textoBotonFoto: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    asignaturaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    inputSmall: {
      flex: 1,
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 16,
      backgroundColor: '#fff',
      marginRight: 10,
    },
    botonEliminar: {
      backgroundColor: '#FF3B30',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    textoBotonEliminar: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    botonAgregar: {
      backgroundColor: '#28A745',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    textoBotonAgregar: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
