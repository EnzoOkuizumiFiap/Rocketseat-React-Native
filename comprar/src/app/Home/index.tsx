import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, Alert } from 'react-native';

import { Item } from '../../components/Item';
import { Input } from '../../components/Input';
import { Filter } from '../../components/Filter';
import { Button } from '../../components/Button';

import { styles } from "./styles";
import { FilterStatus } from '../../types/FilterStatus';
import { itemsStorage, ItemStorage } from '../../storage/itemsStorage';

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<any>([]);

  //Função para Adicionar 
  async function handleAdd() {
    //Caso o nosso Input esteja vazio, exiba esse Alert
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar.");
    }

    //Definimos que o nosso Item terá um id aleatório e um status de PENDING, a description você inseriu no Input 
    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING
    }

    // setItems((prevState) => [...prevState, newItem]); -> Dados in-memory

    //Adicionamos e salvamos no armazenamento 
    await itemsStorage.add(newItem);
    //Chamamos ele para recarregar a lista
    await itemsByStatus();

    setFilter(FilterStatus.PENDING)
    setDescription("")
    //Alert.alert("Adicinado", `Adicionado ${description}`)
  }


  //Função para pegar os Item por Status - Isso para fazer a exibição da lista funcionar!
  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter)
      setItems(response)
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível filtrar os itens")
    }
  }

  async function handleRemove(id: string) {
    try {
      //Remove o item do Storage
      await itemsStorage.remove(id)
      //Chamamos ele para recarregar a lista
      await itemsByStatus()
    } catch (error) {
      console.log(error)
      Alert.alert("Remover", "Não foi possível remover.")
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => onClear() }
    ])
  }

  async function onClear() {
    try {
      await itemsStorage.clear()
      setItems([])
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível remover todos os items")
    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id)
      await itemsByStatus()
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível atualizar o status")
    }
  }

  useEffect(() => {
    itemsByStatus()
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />

      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setDescription}
          value={description}
        />

        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)}
            />
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* Usando ScrollView */}
        {/* <ScrollView>
          {ITEMS.map((value) => (
            <Item
              key={value}
              data={{ status: FilterStatus.DONE, description: String(value) }}
              onStatus={() => console.log("mudar o Status")}
              onRemove={() => console.log("remover")}
            />
          ))}
        </ScrollView> */}

        {/* Usando FlatList */}
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onStatus={() => handleToggleItemStatus(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <Text style={styles.empty} >Nenhum item aqui.</Text>}
        />
      </View>
    </View>
  );
}
