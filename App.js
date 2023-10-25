import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Image} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


  {/*login: mobile 
     senha: App_Daniel1010@@ */}

  const supabaseUrl = 'https://hmbdwmpbncqhisrivszm.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYmR3bXBibmNxaGlzcml2c3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzMyNTEsImV4cCI6MjAxMTkwOTI1MX0.w5wc5bAwmZQgUSrmyJIjJ9O8HbSIv_FJg1tl4oPZzR8';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const Stack = createStackNavigator();

  function LoginScreen({ navigation }) {
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    async function handleLogin() {
      try {
        // Consulta o Supabase para verificar se o usuário com a matrícula existe
        const { data, error } = await supabase
          .from('usuarios')
          .select()
          .eq('matricula', matricula);
    
        if (error) {
          throw error;
        }
    
        if (data.length === 0) {
          setErrorMessage('Matrícula não encontrada');
          return;
        }
    
        // Verifica a senha
        const user = data[0];
        if (user.senha !== password) {
          setErrorMessage('Senha incorreta');
          return;
        }
    
        // Se a matrícula e senha estiverem corretas, você pode redirecionar o usuário ou executar outras ações
        // Por exemplo, aqui estou redirecionando para outra tela chamada 'Home'
        const nome = user.nome;
        navigation.navigate('Welcome', {nome});
        setErrorMessage('');  
        setMatricula('');
        setPassword('');
      } catch (error) {
        console.error('Erro durante o login:', error.message);
        setErrorMessage('Erro durante o login. Por favor, tente novamente.');
      }
    }
  
    return (
      
      <LinearGradient
        colors={['#F600E5', '#833FFB', '#429DFF','#03F9FF']} // Replace with your desired gradient colors
        start={[1.0, 0.0]}
        end={[0.0, 1.0]}
        style={styles.container}
      >
        <Image source={require('./logo-branca.png')} style={styles.logoImage}/>
      <View style={styles.container_mid}>
        <Text style={styles.title}>Entrar em Clinicas Odonto</Text>
        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          value={matricula}
          onChangeText={text => setMatricula(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Button title="Entrar" onPress={handleLogin} />
        {/*<Button title="Registrar novo usuário" onPress={() => navigation.navigate('Register')} />*/}
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
      </LinearGradient>
      
    );
  }
  
  function RegisterScreen({ navigation }) {
    const [matricula, setMatricula] = useState('');
    const [nome, setNome] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleRegistration = () => {
      if (matricula.trim() === '' || nome.trim() === '' || password.trim() === '') {
        // Não permitir o registro se os campos estiverem vazios
        alert('Matrícula, nome e senha são necessários.');
        return;
      }
      if (matricula.length !== 10) {
        alert('A matrícula segue o formato: 000-000000.');
        return;
      }
      if (password.length < 5) {
        alert('A senha deve possuir pelo menos 5 caracteres.');
        return;
      }
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO usuarios (matricula, nome, senha) VALUES (?, ?, ?)',
          [matricula, nome , password],
          (_, results) => {
            if (results.rowsAffected > 0) {
              navigation.navigate('Welcome', { nome });
            } else {
              setErrorMessage('Erro ao criar usuário');
            }
          }
        );
      });
      alert('Usuário registrado com sucesso!');
  };
  
    return (
      <View style={styles.container}>
        <Text>Registrar Novo Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={text => setNome(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Matricula"
          value={matricula}
          onChangeText={text => setMatricula(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Button title="Registrar" onPress={handleRegistration} />
        <Button title="Voltar ao Login" onPress={() => navigation.goBack()} />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  
  function WelcomeScreen({ route, navigation }) {
    const { nome } = route.params;
  
    const data = [
      { key: 'Pacientes para Hoje:', title: 'Lista de Pacientes', icon: 'list' , iconSize: 40},
      { key: 'Pacientes Confirmados:', title: 'Pacientes Confirmados', icon: 'check-circle', iconSize: 46 },
      { key: 'Histórico de Pacientes', title: 'Histórico de Atendimentos', icon: 'history', iconSize: 46 },
      { key: 'Profile', title: 'Seu Perfil', icon: 'user', iconSize: 54 },
    ];
    
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <View style={styles.itemInnerContainer}>
          <Icon name={item.icon} size={item.iconSize} color="#833FFB" />
          <Button title={item.title} onPress={() => {if (item.key === 'Pacientes para Hoje:') {
      navigation.navigate(item.key, { nome });
    } 
    else if (item.key === 'Profile') {
      navigation.navigate(item.key, { nome });
    }
    else {
      navigation.navigate(item.key);
    }}} />
        </View>
      </View>
    );
  
    return (
      
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Olá, {nome}!</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          numColumns={1}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.flatListContainer_bemvindo}
        />
      </View>
    );
  };
 
  function ProfileScreen({ route, navigation }) {
    const { nome } = route.params; // Recupere o nome do usuário da rota de navegação
  
    const handleLogout = () => {
      navigation.navigate('Login');
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>Perfil de {nome}</Text>
        {/* Adicione mais informações do perfil aqui */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
        
    );
  }

  function GenerateNumberScreen({ route, navigation }) {
    const { nome } = route.params;
    const [generatedNumber, setGeneratedNumber] = useState('');
    const [numeroGerado, setNumeroGerado] = useState(false);
    const [filaData, setFilaData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [confirmedItems, setConfirmedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [originalFilaData, setOriginalFilaData] = useState([]);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);



    const GoBack = () => {
      navigation.navigate('Welcome', { nome });
    };

    const handleItemPress = (index) => {
      
    
      // Toggle selection: If the item is already selected, deselect it; otherwise, select it.
      setSelectedItem(selectedItem === index ? null : index);
      setSelectedItemIndex(index);
    };
    
    useEffect(() => {
      // Load the data from the "fila" table only if it hasn't been loaded yet
      if (!dataLoaded) {
        loadFilaData();
        setDataLoaded(true); // Set the flag to true to indicate that data has been loaded
      }
    }, [dataLoaded]); // Only run the effect when dataLoaded changes
  
    const loadFilaData = async () => {
      try {
        const { data, error } = await supabase
          .from('fila')
          .select('*')
          .eq('status', 1)
          .eq('dia_marcado', new Date().toLocaleDateString());
  
        if (error) {
          console.error('Error fetching fila data:', error);
        } else {
          setFilaData(data);
          setOriginalFilaData(data); // Mantenha uma cópia dos dados originais
        }
      } catch (error) {
        console.error('Error fetching fila data:', error);
      }
    };
  

    const generateNumberOnce = () => {
      if (selectedItemIndex === null || confirmedItems.includes(selectedItemIndex)) {
        // No patient selected or already confirmed
        return;
      }
    
      Alert.alert(
        'Confirmar paciente',
        'Tem certeza de que deseja confirmar este paciente?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: confirmPatient,
          },
        ],
        { cancelable: false }
      );
    };
    
    const confirmPatient = async () => {
      try {
        // Obtenha o último número da sequência
        const { data, error } = await supabase
          .from('sequence')
          .select('lastnumber');
    
        if (error) {
          console.error('Error fetching lastNumber:', error);
          return;
        }
    
        const lastNumber = data[0].lastnumber;
        const newNumber = lastNumber + 1;
    
        // Atualize o último número da sequência no Supabase
        const { error: updateError } = await supabase
          .from('sequence')
          .update({ lastnumber: newNumber }) // Dados a serem atualizados
          .eq('id', 1); // Condição para selecionar o registro a ser atualizado
    
        if (updateError) {
          console.error('Error updating lastNumber:', updateError);
          return;
        }
    
        setGeneratedNumber(newNumber.toString());
    
        if (selectedItemIndex !== null && !confirmedItems.includes(selectedItemIndex)) {
          const selectedQueueItem = filaData[selectedItemIndex];
          const selectedItemId = selectedQueueItem.id;
          const uniquePassword = `${newNumber}`;
          const setStatus = '2';
    
          // Atualize os dados do paciente no Supabase
          const { error: updatePatientError } = await supabase
            .from('fila')
            .update({ senha: uniquePassword, status: setStatus, atendimento_aprov: new Date().toLocaleString() })
            .eq('id', selectedItemId);
    
          if (updatePatientError) {
            console.error('Error updating patient data:', updatePatientError);
            return;
          }
    
          // Remova o item confirmado da lista de pacientes na tela
          const updatedFilaData = filaData.filter((item, index) => index !== selectedItemIndex);
          setFilaData(updatedFilaData);
          setSelectedItemIndex(null);
    
          // Adicione o índice do item confirmado à lista de itens confirmados (se necessário)
          // setConfirmedItems([...confirmedItems, selectedItemIndex]);
        }
    
        alert('Paciente confirmado!');
      } catch (error) {
        console.error('Error confirming patient:', error);
      }
    };
    

    const filterList = () => {
      const filteredData = originalFilaData.filter((item) =>
        item.paciente.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilaData(filteredData);
      setSearchModalVisible(false)
    };

    const clearSearch = () => {
      // Defina filaData de volta aos dados originais
      setFilaData(originalFilaData);
      // Limpe o termo de pesquisa
      setSearchTerm('');
      setSearchModalVisible(false)
    };

    return (
      <View>
      {/* Modal de pesquisa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSearchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.searchModalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por nome do paciente"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Button title="Pesquisar" onPress={filterList} />
          <Button title="Limpar Pesquisa" onPress={clearSearch} />
          <Button title="Fechar" onPress={() => setSearchModalVisible(false)} />
        </View>
      </Modal>

      {/* Imagem da lupa que ativa o modal de pesquisa */}
      <View style={styles.lupaContainer}>
        <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
          <Image source={require('./lupa.png')} style={styles.lupaImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.flatListContainer}>
      {filaData.length > 0 ? (
        <FlatList
          data={filaData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                selectedItemIndex === index ? styles.selectedItem : null,
              ]}
              onPress={() => handleItemPress(index)}
            >
              <Text style={styles.itemText1}>Nome: {item.paciente}</Text>
              <Text style={styles.itemText1}>Horário: {item.horario_marcado}</Text>
              <Text style={styles.itemText1}>Dentista: {item.medico}</Text>
              <Text style={styles.itemText1}>Clínica: {item.lugar}</Text>
              {/* Add other fields as needed */}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum paciente na fila para hoje.</Text>
        </View>
      )}
      {selectedItemIndex !== null && (
        <Button title="Confirmar" onPress={generateNumberOnce} />
      )}
      <Button title="Voltar" onPress={GoBack} />
    </View>
    </View>
  );
}

  function ConfirmedPatientsScreen() {
    const [confirmedPatients, setConfirmedPatients] = useState([]);
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [hasConfirmedPatients, setHasConfirmedPatients] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [originalPatients, setOriginalPatients] = useState([]);

  
    useEffect(() => {
      // Função para buscar os pacientes confirmados do Supabase
      async function fetchConfirmedPatients() {
        try {
          const { data, error } = await supabase
            .from('fila')
            .select('*')
            .eq('status', 2); // Status 2 representa pacientes confirmados
  
          if (error) {
            throw error;
          }
  
          setConfirmedPatients(data || []);
          setOriginalPatients(data || []);
          setHasConfirmedPatients(data && data.length > 0);
        } catch (error) {
          console.error('Erro ao buscar pacientes confirmados:', error);
        }
      }
  
      fetchConfirmedPatients();
    }, []);

    const handleUnconfirm = (itemId) => {
      Alert.alert(
        'Remover Aprovação',
        'Tem certeza de que deseja cancelar este paciente?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: () => unconfirmPatient(itemId),
          },
        ],
        { cancelable: false }
      );
    };
    
    const unconfirmPatient = async (itemId) => {
      try {
        // Realize a atualização no Supabase para marcar o paciente como não confirmado
        const { error } = await supabase
          .from('fila')
          .update({
            status: 1,
            senha: "0",
            atendimento_aprov: null
          })
          .eq('id', itemId);
    
        if (error) {
          throw error;
        }
    
        // Atualize o estado para refletir a mudança (remover o paciente não confirmado)
        setConfirmedPatients((prevState) =>
          prevState.filter((patient) => patient.id !== itemId)
        );
    
        alert('Paciente removido.');
      } catch (error) {
        console.error('Erro ao remover paciente:', error);
      }
    };

    const filterList = () => {
      const filteredData = originalPatients.filter((item) =>
        item.paciente.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setConfirmedPatients(filteredData);
      setSearchModalVisible(false);
    };
    
  
    const clearSearch = () => {
      // Reset the filtered data and search term
      setConfirmedPatients(originalPatients);
      setSearchTerm('');
      setSearchModalVisible(false);
    };

    return (
      <View>
      {/* Modal de pesquisa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSearchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.searchModalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por nome do paciente"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Button title="Pesquisar" onPress={filterList} />
          <Button title="Limpar Pesquisa" onPress={clearSearch} />
          <Button title="Fechar" onPress={() => setSearchModalVisible(false)} />
        </View>
      </Modal>

      {/* Imagem da lupa que ativa o modal de pesquisa */}
      <View style={styles.lupaContainer}>
        <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
          <Image source={require('./lupa.png')} style={styles.lupaImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.flatListContainer}>
        {hasConfirmedPatients ? (
        <FlatList 
          data={confirmedPatients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              
              <Text style={styles.itemTextOdd}>Nome: {item.paciente}</Text>
              <Text style={styles.itemText}>Senha de Atendimento: {item.senha}</Text>
              <Text style={styles.itemTextOdd}>Clínica: {item.lugar}</Text>
              <Text style={styles.itemText}>Dentista Responsável: {item.medico}</Text>
              {expandedPatient === item.id && (
                <View>
                  {/* Additional patient details here */}
                  <Text style={styles.itemTextOdd}>Horário de Aprovação: {item.atendimento_aprov}</Text>
                  <Text style={styles.itemText}>Contato: {item.telefone}</Text>
                  <Text style={styles.itemTextOdd}>Email: {item.email}</Text>
                  <Text style={styles.itemText}>Endereço: {item.endereco}</Text>
                  {/* Add more details as needed */}
                </View>
              )}
              <Button
                title={expandedPatient === item.id ? "Fechar Detalhes" : "Ver Detalhes"}
                onPress={() =>
                  setExpandedPatient(
                    expandedPatient === item.id ? null : item.id
                  )
                }
              />
              <Button
                title="Desmarcar"
                onPress={() => handleUnconfirm(item.id)}
              />
            </View>
          )}
        />
        ) : (
          <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum paciente confirmado.</Text>
          </View>
        )}
      </View>
      </View>
    );
  }
  
  function StatusFourScreen() {
    const [confirmedPatients, setConfirmedPatients] = useState([]);
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [hasConfirmedPatients, setHasConfirmedPatients] = useState(false);

  
    useEffect(() => {
      // Execute a query to retrieve confirmed patients from Supabase
      const fetchConfirmedPatients = async () => {
        const { data, error } = await supabase
          .from('fila')
          .select('*')
          .eq('status', 4); // Status 4 represents finished patients
  
        if (error) {
          console.error('Error fetching confirmed patients:', error);
        } else {
          setConfirmedPatients(data);
          setHasConfirmedPatients(data.length > 0); // Set the flag based on the number of confirmed patients
        }
      };
  
      fetchConfirmedPatients();
    }, []);


    return (
      <View style={styles.flatListContainer2}>
        {hasConfirmedPatients ? (
        <FlatList
          data={confirmedPatients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>   </Text>
              <Text style={styles.itemTextOdd}>Nome: {item.paciente}</Text>
              <Text style={styles.itemText}>Procedimento: {item.procedimento}</Text>
              <Text style={styles.itemTextOdd}>Prontuário: {item.prontuario}</Text>
              <Text style={styles.itemText}>Dentista Responsável: {item.medico}</Text>
              <Text style={styles.itemTextOdd}>Clínica: {item.lugar}</Text>
              {expandedPatient === item.id && (
                <View>
                  {/* Additional patient details here */}
                  <Text style={styles.itemText}>Tutor: {item.tutor}</Text>
                  <Text style={styles.itemTextOdd}>Horário Previsto: {item.horario_marcado} {formatDate(item.dia_marcado)}</Text>
                  <Text style={styles.itemText}>Horário de Aprovação: {item.atendimento_aprov}</Text>
                  <Text style={styles.itemTextOdd}>Início do Procedimento: {item.inicio_atendimento}</Text>
                  <Text style={styles.itemText}>Fim do Procedimento: {item.fim_atendimento}</Text>
                  <Text style={styles.itemTextOdd}>Duração do Procedimento: {item.duracao}</Text>
                  <Text style={styles.itemText}>Observação: {item.observacao}</Text>
                  <Text style={styles.itemTextOdd}>Contato: {item.telefone}</Text>
                  <Text style={styles.itemText}>Email: {item.email}</Text>
                  <Text style={styles.itemTextOdd}>Endereço: {item.endereco}</Text>
                  {/* Add more details as needed */}
                </View>
              )}
              <Button
                title={expandedPatient === item.id ? "Fechar Detalhes" : "Ver Detalhes"}
                onPress={() =>
                  setExpandedPatient(
                    expandedPatient === item.id ? null : item.id
                  )
                }
              />
            </View>
          )}
        />
        ) : (
          <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum paciente finalizado.</Text>
          </View>
        )}
      </View> 
    );
  }
  export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Pacientes para Hoje:" component={GenerateNumberScreen} />
          <Stack.Screen name="Pacientes Confirmados:" component={ConfirmedPatientsScreen} />
          <Stack.Screen name="Histórico de Pacientes" component={StatusFourScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const formatDate = (dateString) => {
    const parts = dateString.split('-'); // Divide a data em ano, mês e dia
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    } else {
      return 'Data Inválida';
    }
  };

const styles = StyleSheet.create({
  backTudo:{
    backgroundColor: '#EBE0FF',
    zIndex: 0,
  },
  searchModalContainer: {
    flex: 1,
    marginTop: 100, // Ajuste esta margem conforme necessário
    backgroundColor: 'hsl(0, 0%, 92%)', // Define o fundo branco para a modal
    padding: 20,
    
  },
  searchInput: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  lupaContainer: {
    position: 'absolute',
    top: 30, // Ajuste a posição vertical conforme necessário
    right: 30, // Ajuste a posição horizontal conforme necessário
  },

  lupaImage: {
    width: 36, // Defina a largura desejada
    height: 36, // Defina a altura desejada
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray', // You can adjust the color to your preference
  },
  flatListContainer: {
    height: 600,
    margin: 40,
    top: 30,
  },
  flatListContainer2: {
    height: 600,
    margin: 40,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF', // Background color for the item
    padding: 10, // Adjust the padding as needed for separation
    margin: 10, // Adjust the margin as needed for separation
    borderRadius: 10, // Add border radius for a square appearance
    borderWidth: 1, // Add a border to separate items
    borderColor: '#E0E0E0', // Border color
  },
  itemText1: {
    fontSize: 16,
    marginLeft: 10, // Adjust the margin as needed for separation
    marginRight: 10,
    padding: 0.5,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10, // Adjust the margin as needed for separation
    marginRight: 10,
    paddingTop: 3.75,
    paddingBottom: 3.75,
    paddingLeft: 3,
    paddingRight: 3,
    backgroundColor: '#ECECEC'
  },
  itemTextOdd: {
    fontSize: 16,
    marginLeft: 10, // Adjust the margin as needed for separation
    marginRight: 10,
    paddingTop: 3.75,
    paddingBottom: 3.75,
    paddingLeft: 3,
    paddingRight: 3,
    backgroundColor: '#D3D3D3',
  },
  evenItem: {
    fontSize: 16,
    padding: 5, // Adjust the padding as needed for separation
    marginLeft: 10, // Adjust the margin as needed for separation
    marginRight: 10,
    backgroundColor: '#e0e0e0', // Cor de fundo para linhas pares (cinza)
  },
  oddItem: {
    fontSize: 16,
    padding: 5, // Adjust the padding as needed for separation
    marginLeft: 10, // Adjust the margin as needed for separation
    marginRight: 10,
    backgroundColor: 'transparent', // Cor de fundo para linhas ímpares (transparente)
  },
  selectedItem: {
    backgroundColor: '#E0E0E0', // Change the background color when selected
  },
  confirmedItem: {
    backgroundColor: '#8effa5', // Change the background color for confirmed items
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHub: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBE0FF'
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginVertical: 10,
    width: 200,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  welcome_container: {
    backgroundColor: '#FFDDDD', 
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 200,
  },
  errorMessage: {
    color: 'red',
    marginTop: 5,
    marginBottom: 20,
  },
  gradientBackground: {
      position: 'center',
      backgroundColor: 'linear-gradient(to bottom right, #8A2BE2, #87CEEB)', // Adjust gradient colors
      zIndex: 1, // Place it behind other content
  },
  container_mid: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 35,
    paddingBottom: 0,
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
    ...Platform.select({
      android: {
        elevation: 5, // Adiciona sombra no Android
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4, // Adiciona sombra no iOS
      },
    }),
  },
  title: {
    fontSize: 20, // You can adjust the font size as needed
    fontWeight: 'bold', // Add this line to make the text bold
    marginBottom: 20,
  },
  logoImage: {
    width: 220, // Defina a largura desejada
    height: 65,
    marginTop: -190,
    marginBottom: 60,
    ...Platform.select({
      android: {
        elevation: 5, // Adiciona sombra no Android
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4, // Adiciona sombra no iOS
      },
    }),
  },
  welcomeText: {
    marginTop: 30,
    fontSize: 24,
    marginBottom: 20,
  },
  itemInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatListContainer_bemvindo: {
    height: 600,
  },
  logoutButton: {
    backgroundColor: 'red', // Cor de fundo do botão
    padding: 10,
    borderRadius: 5,
    marginBottom: 50,
    marginTop: 50,
  },
  logoutButtonText: {
    color: 'white', // Cor do texto do botão
    fontSize: 16,
  },
  icone:{
    width: 20,
  }
});