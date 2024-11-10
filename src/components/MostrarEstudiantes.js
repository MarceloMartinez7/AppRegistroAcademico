import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const MostrarEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerEstudiantes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'estudiantes'));
        const listaEstudiantes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEstudiantes(listaEstudiantes);
      } catch (error) {
        console.error('Error al obtener los estudiantes: ', error);
      }
    };

    obtenerEstudiantes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.foto || 'https://via.placeholder.com/150' }} style={styles.imagen} />
      <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
      <Text style={styles.matricula}>Matrícula: {item.matricula}</Text>
      <Text style={styles.promedio}>Promedio General: {item.promedio}</Text>
      <Text style={styles.asignaturasTitulo}>Asignaturas:</Text>
      {item.asignaturas && item.asignaturas.map((asig, index) => (
        <Text key={index} style={styles.asignatura}>
          {asig.asignatura} - Promedio: {asig.promedio}
        </Text>
      ))}

      {/* Botones para actualizar y eliminar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate('ActualizarEstudiante', { id: item.id })}
        >
          <Icon name="create-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => navigation.navigate('EliminarEstudiante', { id: item.id })}
        >
          <Icon name="trash-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Estudiantes</Text>
      <FlatList
        data={estudiantes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
      />

      {/* Botón circular flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AgregarEstudiante')}
      >
        <Icon name="person-add" size={40} color="#17c82a" />
      </TouchableOpacity>
    </View>
  );
};

export default MostrarEstudiantes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imagen: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  matricula: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  promedio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8449',
  },
  asignaturasTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  asignatura: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
});
