import React from 'react';
import react, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, TextInput,
FlatList, Modal, AsyncStorage } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';


const AnimateBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {

  const [task, setTask] = useState([]);
  const [Open, setOpen] = useState(false);
  const [input, steInput] = useState('');

  useEffect( () => {
   async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task');

      if(taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks(){
      await AsyncStorage.setItem('@task',JSON.stringify(task));
    }

    saveTasks();
  },[task]);

  function handleadd(){
    if(input ==='') return;

    const data ={
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    steInput('');
  }

 const handleDelete = useCallback((data) => {
   const find = task.filter(r => r.key !== data.key)
   setTask(find);
 })

  return(
    <SafeAreaView style={styles.conteiner}>
      <StatusBar backgroundColor="#171d31" barStyle="light-content"/>

      <View stele={styles.content}>
        <Text style={styles.title}>minhas tarefas</Text>
      </View>

      <FlatList 
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={ (item) => String(item.key) }
        renderItem={ ({item}) => <TaskList data={item} handleDelete={handleDelete}/>}
      />

      <Modal animationType="slide" transparent={false} visible={Open}>

        <SafeAreaView style={styles.modal}>
            <View style={styles.modalHeader}>

              <TouchableOpacity onPress={ () => setOpen(false)}>
                <Ionicons style={{marginLeft: 5, marginRight:5}} name="md-arrow-back" size={40} color="#FFF"/>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Nova tarefa</Text>

            </View>

            <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver>
              <TextInput 
                multiline={true}
                placeholderTextColor="#747474"
                autoCorrect={false}
                placeholder="o que precisa fazer hoje?"
                style={styles.input}
                value={input}
                onChangeText={ (texto) => steInput(texto)}
              />
              <TouchableOpacity style={styles.handleadd} onPress={handleadd}>
                <Text style={styles.handleaddText}>Cadastrar</Text>
              </TouchableOpacity>
            </Animatable.View>
        </SafeAreaView>
      
      </Modal>



      <AnimateBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ () => setOpen(true) }>

          <Ionicons name="ios-add" size={35} color="#FFF" />

      </AnimateBtn>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  conteiner:{
    flex:1,
    backgroundColor: '#171d31',
  },
  title:{
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#FFF'
  },

  fab:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height: 3,

    }
  },
  modal:{
    flex: 1,
    backgroundColor: '#171d31',
  },
  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle:{
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF'
  },
  modalBody:{
    marginTop: 15,

  },
  input:{
    fontSize: 15,
    marginLeft: 10,
    marginRight:10,
    marginTop:30,
    backgroundColor: '#FFF',
    padding: 9,
    height:85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,

  },
  handleadd:{
    backgroundColor: '#FFF',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },
  handleaddText:{
    fontSize: 20,
  }
});

