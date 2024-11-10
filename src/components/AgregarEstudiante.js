import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const FormularioEstudiante = () => {
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState('');
  const [asignaturas, setAsignaturas] = useState([{ asignatura: '', promedio: '' }]);
  const navigation = useNavigation();

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

  const generarMatricula = () => {
    const timestamp = Date.now().toString();
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}-${randomNumber}`;
  };

  const agregarEstudiante = async () => {
    if (!nombre || asignaturas.length === 0) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const matricula = generarMatricula(); // Genera la matrícula automáticamente
      const estudianteData = {
        nombre,
        matricula,
        foto,
        asignaturas,
      };

      // Guardar el estudiante con la matrícula generada como ID en Firebase
      await setDoc(doc(db, 'estudiantes', matricula), estudianteData);

      Alert.alert('Éxito', 'Estudiante agregado exitosamente');
      setNombre('');
      setFoto('');
      setAsignaturas([{ asignatura: '', promedio: '' }]);
      navigation.goBack();
    } catch (error) {
      console.error('Error al agregar estudiante: ', error);
      Alert.alert('Error', 'No se pudo agregar el estudiante');
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
      <Text style={styles.titulo}>Agregar Nuevo Estudiante</Text>
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

      <Button title="Guardar Estudiante" onPress={agregarEstudiante} />
    </View>
  );
};
export default FormularioEstudiante;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  botonFoto: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  textoBotonFoto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  asignaturaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  botonEliminar: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 5,
  },
  textoBotonEliminar: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#28a745',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  textoBotonAgregar: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
