import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { storeIdInFile, readIdFromFile } from '../filehandel';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Getbilldata = () => {
  const domain = "https://kapad.developeraadesh.cfd"
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [newSize, setNewSize] = useState('');
  const [newCount, setNewCount] = useState('');
  const [remark, setRemark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const isFocused = useIsFocused();
  const [billId, setBillId] = useState('');
  const [buffer, setBuffer] = useState(true)
  const getData = () => {
    console.log("Getting data: ")
    axios
      .get(`${domain}/product/get/${billId}`)
      .then((response) => {
        console.log(response.data.data)
        setData(response.data.data);
        setBuffer(false)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editData = (name, qualityIndex) => {
    console.log(remark)
    axios
      .post(`${domain}/product/edit/${billId}`, {
        name: name,
        size: newSize,
        count: newCount,
      })
      .then((response) => {
        getData();
        setModalVisible(false);
        setNewSize('');
        setNewCount('');
      })
      .catch((err) => {
        console.log(err);
      });
    axios.post(`${domain}/product/addremark/${billId}`, { name, remark })
      .then((response) => {
        console.log(response.data);
        setRemark('');
      })
      .catch((err) => {
        console.log(err.message)
      });
  };

  const deleteData = () => {
    axios
      .post(`${domain}/product/deleteSize/${billId}`, {
        name: editItem.name,
        size: newSize,
      })
      .then((response) => {
        getData(); // Refresh data after successful delete
        setModalVisible(false); // Close the modal
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this quality?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => deleteData()
        }
      ]
    );
  };

  const openEditModal = (item, index) => {
    setEditItem({ ...item, qualityIndex: index });
    setNewSize(item.quality[index].size);
    setNewCount(item.quality[index].count);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
    setEditItem(null);
  };

  const handleDoubleClick = (item, index) => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 300) { // 300 ms for double click
      openEditModal(item, index);
    }
    setLastClickTime(currentTime);
    setRemark(item.remark);
  };

  useEffect(() => {
    if (isFocused && billId) {
      getData();
    }
  }, [isFocused, billId]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchId = async () => {
        try {
          const id = await readIdFromFile();
          console.log("Stored ID:", id);
          setBillId(id); // Set the billId directly here
        } catch (error) {
          console.error("Error reading ID from file:", error);
        }
      };
      fetchId();
    }, [])
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={{width: 60}}>Size</Text>
        <Text style={{width: 60}}>Count</Text>
      </View>
      {
        buffer && (<ActivityIndicator size="large" color="#0000ff" style={{marginTop: 200}}/>)
      }
      {data.map((item) =>
        item.quality.map((qualityItem, index) => (
          <TouchableOpacity
            style={styles.row}
            key={`${item._id}-${index}`}
            onPress={() => handleDoubleClick(item, index)} // Handle double click
          >
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={{width: 60}}>{qualityItem.size}</Text>
            <Text style={{width: 60}}>{qualityItem.count}</Text>
          </TouchableOpacity>
        ))
      )}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Edit Item: {editItem ? editItem.name : ''}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDelete}
              >
                <Icon name="delete" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text>Size: {newSize}</Text>
            <TextInput
              style={styles.input}
              placeholder="Count"
              value={newCount}
              onChangeText={setNewCount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="remark"
              value={remark}
              onChangeText={setRemark}
            />
            <Button
              title="Save"
              onPress={() => editData(editItem.name, editItem.qualityIndex)}
            />
            <View style={styles.marginBottom} />
            <Button title="Cancel" onPress={closeEditModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    padding: 5,
  },
  marginBottom: {
    marginBottom: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default Getbilldata;
