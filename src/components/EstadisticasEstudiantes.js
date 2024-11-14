import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Button } from 'react-native';
import { db } from '../database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import jsPDF from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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

  const generarPDF = async () => {
    try {
      const doc = new jsPDF();
      doc.text("Reporte de Estadísticas de Asignaturas", 10, 10);

      // Sección 1: Promedio por Asignatura (BarChart)
      doc.text("Promedio por Asignatura", 10, 20);
      promediosAsignaturas.forEach((item, index) => {
        doc.text(`${item.asignatura}: ${item.promedio.toFixed(2)}`, 10, 30 + index * 10);
      });

      // Sección 2: Tendencia del Promedio (LineChart)
      doc.text("Tendencia del Promedio", 10, 50 + promediosAsignaturas.length * 10);
      promediosAsignaturas.forEach((item, index) => {
        doc.text(`${item.asignatura}: ${item.promedio.toFixed(2)}`, 10, 60 + promediosAsignaturas.length * 10 + index * 10);
      });

      // Sección 3: Proporción por Promedio (PieChart)
      doc.text("Proporción por Promedio", 10, 80 + promediosAsignaturas.length * 20);
      const estudiantesConPromedioAlto = estudiantesData.filter((estudiante) =>
        estudiante.asignaturas.some((asig) => parseFloat(asig.promedio) >= 70)
      ).length;

      const estudiantesConPromedioBajo = estudiantesData.filter((estudiante) =>
        estudiante.asignaturas.some((asig) => parseFloat(asig.promedio) < 70)
      ).length;

      doc.text(`Promedio >= 70: ${estudiantesConPromedioAlto}`, 10, 90 + promediosAsignaturas.length * 20);
      doc.text(`Promedio < 70: ${estudiantesConPromedioBajo}`, 10, 100 + promediosAsignaturas.length * 20);

      // Guardar y compartir PDF
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_estadisticas_asignaturas.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
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

      <Button title="Generar PDF" onPress={generarPDF} />
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
