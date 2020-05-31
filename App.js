import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard, Alert, AsyncStorage, Linking} from 'react-native';
import {Ionicons, MaterialIcons} from "@expo/vector-icons"

export default function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] =useState('');
  


  async function addTask(){
    if (newTask == ""){
      return;
    }
    const search = task.filter(task => task == newTask);

    if(search.length != 0){
      Alert.alert("Atenção", "Ja existe uma tarefa com esse nome!");
      return;
    }

    setTask([... task, newTask]);
    setNewTask('');

    Keyboard.dismiss();
  }

  async function editTask(item){
    setNewTask(item);
    setTask(task.filter(tasks => tasks != item))
    

  }

  async function deleteTask(item){
    Alert.alert(
      "Deletar Tarefa?",
      "Tem Certeza? Essa ação não podera ser desfeita!",
      [
        {
          text: "Não",
          onPress: () => { return },
          style:'cancel'
        },
        {
          text: "Excluir",
          onPress: () => setTask(task.filter(tasks => tasks != item))
        }
       
      ],
      { cancelable: false }
    );
  
  }
  useEffect( () => {
    async function loadData(){
      const task = await AsyncStorage.getItem('task');

      if(task){
        setTask(JSON.parse(task));
      }
    }
    loadData();
  }, [])


  useEffect(() => {
    async function saveData(){
      AsyncStorage.setItem('task', JSON.stringify(task))
    }
    saveData();
  }, [task])

  return (
    <>
    <KeyboardAvoidingView 
      keyboardVerticalOffset={0}
      behavior='padding'
      style={{flex: 1}}
      enabled={Platform.OS == 'ios'}
     >
      <View style={styles.container}>
      <Text style={{color: 'blue', textDecorationLine: 'underline'}}
          onPress={() => Linking.openURL('https://github.com/AlexmarJr/Udok_Project')}>
      Projeto em PHP
      </Text>

      <Text style={{color: 'blue', textDecorationLine: 'underline'}}
          onPress={() => Linking.openURL('http://udok-project.herokuapp.com/')}>
      Site no Ar
      </Text>


        <View style={styles.Body}>
          <FlatList style={styles.FlatList} 
          data={task}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator= {false}
          renderItem= {( {item} ) => (
            <View style={styles.ConteinerView}>
              <Text style={styles.Texto}>{item}</Text>
              <TouchableOpacity onPress={() => editTask(item)}>
                <MaterialIcons name="edit" size={25} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item)}>
                <MaterialIcons name="delete-forever" size={25} color="red" />
              </TouchableOpacity>
            </View>
          )}
          />
        </View>
        <View style={styles.Form}>
          <TextInput style={styles.Input}
          placeholderTextColor="#999"
          autoCorrect={true}
          placeholder= "Adicione um Item"
          maxLength= {50}
          onChangeText={text=>setNewTask(text)}
          value={newTask}
          />
          
          <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
            <Ionicons name="ios-add" size={25} color="#fff"/>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20
  },

  Body: {
    flex: 1
  },
   Form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 5,
    borderTopWidth: 0,
    borderBottomColor:'#eee',
    backgroundColor: "white"
   },

   Input: {
     flex: 1,
     height: 45,
     backgroundColor: '#eee',
     borderRadius: 4,
     paddingVertical: 5,
     paddingHorizontal: 10,
     borderWidth: 1,
     borderColor: '#eee'
   },

   Button: {
     height: 40,
     width: 40,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#1c6cce',
     borderRadius: 4,
     marginLeft: 10
   },

   FlatList:{
     flex: 1,
     marginTop: 25
   },

   ConteinerView: {
     marginBottom: 15,
     padding: 15,
     borderRadius: 4,
     backgroundColor: "#eee",
     display: 'flex',
     flexDirection: 'row',
     justifyContent: "space-between",
     borderColor: "#eee",
     alignItems: 'center'
   },
   Texto:{
    fontSize: 14,
    color: "#333",
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center'
    }

});
