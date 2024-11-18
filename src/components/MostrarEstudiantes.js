import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const MostrarEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const navigation = useNavigation();

  const obtenerEstudiantes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'estudiantes'));
      const listaEstudiantes = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const asignaturas = data.asignaturas || [];
        const sumaPromedios = asignaturas.reduce((acc, curr) => acc + (parseFloat(curr.promedio) || 0), 0);
        const promedioGeneral = asignaturas.length > 0 ? sumaPromedios / asignaturas.length : 0;

        return {
          id: doc.id,
          ...data,
          promedio: promedioGeneral.toFixed(2),
        };
      });
      setEstudiantes(listaEstudiantes);
    } catch (error) {
      console.error('Error al obtener los estudiantes: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerEstudiantes();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.foto || 'https://via.placeholder.com/150' }} style={styles.imagen} />
      <View style={styles.cardContent}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.matricula}>Matrícula: {item.matricula}</Text>
        <Text style={styles.promedio}>Promedio General: {item.promedio}</Text>
        <Text style={styles.asignaturasTitulo}>Asignaturas:</Text>
        {item.asignaturas && item.asignaturas.map((asig, index) => (
          <Text key={index} style={styles.asignatura}>
            • {asig.asignatura}: {asig.promedio}
          </Text>
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate('ActualizarEstudiante', { id: item.id })}
          >
            <Icon name="create-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => navigation.navigate('EliminarEstudiante', { id: item.id })}
          >
            <Icon name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    marginTop: 50,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 4,
  },
  matricula: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  promedio: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  asignaturasTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495E',
    marginTop: 8,
  },
  asignatura: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centra los botones
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4, // Reduce la separación entre botones
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    padding: 8, // Igual al de actualizar
    marginHorizontal: 4, // Reduce la separación entre botones
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 50,
    elevation: 5,
    padding: 10,
  },
});
