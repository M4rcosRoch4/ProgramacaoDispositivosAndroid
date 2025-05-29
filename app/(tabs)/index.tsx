import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
}

export default function HomeScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');

  const addMedication = () => {
    if (name && dose && time) {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name,
        dose,
        time,
      };
      setMedications([...medications, newMedication]);
      setName('');
      setDose('');
      setTime('');
    }
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const downloadMedicationsList = async () => {
    try {
      if (medications.length === 0) {
        Alert.alert('Aviso', 'Não há medicamentos para baixar.');
        return;
      }

      // Criar o conteúdo HTML do PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { text-align: center; color: #333; }
              .medication { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
              .medication h3 { margin: 0; color: #007AFF; }
              .medication p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>Lista de Medicamentos</h1>
            ${medications.map(med => `
              <div class="medication">
                <h3>${med.name}</h3>
                <p>Dose: ${med.dose}</p>
                <p>Horário: ${med.time}</p>
              </div>
            `).join('')}
          </body>
        </html>
      `;

      // Criar o arquivo HTML temporário
      const fileUri = FileSystem.documentDirectory + 'medicamentos.html';
      await FileSystem.writeAsStringAsync(fileUri, htmlContent);

      // Compartilhar o arquivo
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/html',
        dialogTitle: 'Lista de Medicamentos',
        UTI: 'public.html'
      });

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível baixar a lista de medicamentos.');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Controle de Medicamentos</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome do remédio"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Dose (ex: 1 comprimido)"
          value={dose}
          onChangeText={setDose}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Horário (ex: 08:00)"
          value={time}
          onChangeText={setTime}
        />
        
        <TouchableOpacity style={styles.button} onPress={addMedication}>
          <Text style={styles.buttonText}>Adicionar Medicamento</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.subtitle}>Medicamentos do Dia</Text>
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={downloadMedicationsList}
          >
            <Text style={styles.downloadButtonText}>Baixar Lista</Text>
          </TouchableOpacity>
        </View>
        {medications.map((item) => (
          <View key={item.id} style={styles.medicationItem}>
            <View style={styles.medicationHeader}>
              <Text style={styles.medicationName}>{item.name}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteMedication(item.id)}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <Text>Dose: {item.dose}</Text>
            <Text>Horário: {item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#34C759',
    padding: 8,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
