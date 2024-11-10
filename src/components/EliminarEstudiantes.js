import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const EliminarEstudiante = () => {
  const [estudiantes, setEstudiantes] = useState([]);

  // Cargar la lista de estudiantes desde Firebase
  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        const estudiantesSnapshot = await getDocs(collection(db, 'estudiantes'));
        const listaEstudiantes = estudiantesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEstudiantes(listaEstudiantes);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
      }
    };

    cargarEstudiantes();
  }, []);

  // Función para eliminar estudiante
  const eliminarEstudiante = async (matricula) => {
    try {
      await deleteDoc(doc(db, 'estudiantes', matricula));
      Alert.alert('Éxito', 'Estudiante eliminado correctamente');
      // Actualizar la lista de estudiantes
      setEstudiantes(estudiantes.filter((estudiante) => estudiante.id !== matricula));
    } catch (error) {
      console.error('Error al eliminar el estudiante:', error);
      Alert.alert('Error', 'No se pudo eliminar el estudiante');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eliminar Estudiante</Text>
      <FlatList
        data={estudiantes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.estudianteItem}>
            <Text style={styles.estudianteNombre}>{item.nombre}</Text>
            <TouchableOpacity
              onPress={() => eliminarEstudiante(item.id)}
              style={styles.botonEliminar}
            >
              <Text style={styles.textoBotonEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  estudianteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  estudianteNombre: {
    fontSize: 16,
  },
  botonEliminar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EliminarEstudiante;
