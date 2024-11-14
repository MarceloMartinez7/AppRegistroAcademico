import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit'; // Importa sólo algunos gráficos

const GraficosEstadisticos = () => {
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
    datasets: [{ data: promediosAsignaturas.map((item) => item.promedio) }],
  };

  const lineChartData = {
    labels: promediosAsignaturas.map((item) => item.asignatura),
    datasets: [{ data: promediosAsignaturas.map((item) => item.promedio) }],
  };

  const pieChartData = [
    {
      name: 'Promedio >= 70',
      population: estudiantesData.filter((estudiante) =>
        estudiante.asignaturas.some((asig) => parseFloat(asig.promedio) >= 70)
      ).length,
      color: 'green',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Promedio < 70',
      population: estudiantesData.filter((estudiante) =>
        estudiante.asignaturas.some((asig) => parseFloat(asig.promedio) < 70)
      ).length,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Promedio por Asignatura (BarChart)</Text>
        <BarChart
          data={barChartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Tendencia del Promedio (LineChart)</Text>
        <LineChart
          data={lineChartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Proporción por Promedio (PieChart)</Text>
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
    </ScrollView>
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
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default GraficosEstadisticos;