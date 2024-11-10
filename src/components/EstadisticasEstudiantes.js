import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, PieChart } from 'react-native-chart-kit';

const GraficoEstudiantes = () => {
  const [promediosAsignaturas, setPromediosAsignaturas] = useState([]);
  const [estudiantesData, setEstudiantesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerDatosEstadisticos();
  }, []);

  const obtenerDatosEstadisticos = async () => {
    try {
      const estudiantesSnapshot = await getDocs(collection(db, 'estudiantes'));
      const estudiantesData = estudiantesSnapshot.docs.map((doc) => doc.data());

      if (estudiantesData.length === 0) {
        setLoading(false);
        return;
      }

      let asignaturaPromedios = {};

      estudiantesData.forEach((estudiante) => {
        estudiante.asignaturas.forEach((asignatura) => {
          const promedio = parseFloat(asignatura.promedio) || 0;
          if (asignaturaPromedios[asignatura.asignatura]) {
            asignaturaPromedios[asignatura.asignatura].push(promedio);
          } else {
            asignaturaPromedios[asignatura.asignatura] = [promedio];
          }
        });
      });

      const promediosAsignaturas = Object.keys(asignaturaPromedios).map((asignatura) => {
        const promedios = asignaturaPromedios[asignatura];
        const promedio = promedios.reduce((a, b) => a + b, 0) / promedios.length;
        return { asignatura, promedio };
      });

      setPromediosAsignaturas(promediosAsignaturas);
      setEstudiantesData(estudiantesData);
    } catch (error) {
      console.error('Error al obtener estadísticas: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const barChartData = {
    labels: promediosAsignaturas.map((item) => item.asignatura),
    datasets: [
      {
        data: promediosAsignaturas.map((item) => item.promedio),
      },
    ],
  };

  const promedioGeneral = 70;
  const estudiantesPorEncimaPromedio = estudiantesData.filter((estudiante) => {
    const promedioEstudiante = estudiante.asignaturas.reduce((acc, asig) => acc + parseFloat(asig.promedio || 0), 0) / estudiante.asignaturas.length;
    return promedioEstudiante >= promedioGeneral;
  }).length;
  const estudiantesPorDebajoPromedio = estudiantesData.length - estudiantesPorEncimaPromedio;

  const pieChartData = [
    { name: '>= 70', population: estudiantesPorEncimaPromedio, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: '< 70', population: estudiantesPorDebajoPromedio, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promedio por Asignatura</Text>
      <BarChart
        data={barChartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix="%"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />

      <Text style={styles.title}>Proporción de Estudiantes por Promedio</Text>
      <PieChart
        data={pieChartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo: '#FFF',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default GraficoEstudiantes;
