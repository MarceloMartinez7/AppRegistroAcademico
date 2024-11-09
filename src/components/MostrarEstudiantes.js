// CatalogoEstudiantes.js
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
        const querySnapshot = await getDocs(collection(db, 'registrosAcademicos'));
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
        onPress={() => navigation.navigate('AgregarEstudiante')} // Navega al formulario para agregar estudiante
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
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
});
