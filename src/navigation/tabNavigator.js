import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AntDesign from '@expo/vector-icons/AntDesign';

import FormularioEstudiante from '../components/AgregarEstudiante';
import EliminarEstudiante from '../components/EliminarEstudiantes';
import Inicio from '../components/Inicio';
import ActualizarEstudiante from '../components/ActualizarEstudiante';
import EstadisticasEstudiantes from '../components/EstadisticasEstudiantes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configura las pestañas de navegación
function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Inicio">
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <AntDesign name="appstore-o" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Estadisticas"
        component={EstadisticasEstudiantes}
        options={{
          tabBarLabel: 'Estadisticas',
          tabBarIcon: ({ color, size }) => <AntDesign name="linechart" size={24} color={color} />, // Cambiado a 'linechart'
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// Configura el Stack Navigator que contiene las pestañas y el formulario
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AgregarEstudiante"
        component={FormularioEstudiante}
        options={{ title: 'Agregar Estudiante' }}
      />
      <Stack.Screen
        name="EliminarEstudiante"
        component={EliminarEstudiante}
        options={{ title: 'Eliminar Estudiante' }}
      />
      <Stack.Screen
        name="ActualizarEstudiante"
        component={ActualizarEstudiante}
        options={{ title: 'Actualizar Estudiante' }}
      />
    </Stack.Navigator>
  );
}

// Componente principal de navegación
export default function Navegacion() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}