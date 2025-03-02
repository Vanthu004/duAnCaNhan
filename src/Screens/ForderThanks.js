import { Image, StyleSheet, Text, TouchableOpacity, View,FlatList, Alert } from 'react-native'
import React,{useState, useEffect, useRef,}  from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { ref, onValue, remove } from 'firebase/database';
import Toast from 'react-native-toast-message';
import { database } from './configFirebase'; 
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from './configFirebase';

const CustomCheckbox = ({ isChecked, onPress }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};
//check book



const ForderThanks = ({route,navigation}) => {

  const { date } = route.params;
  const [messages, setMessages] = useState([]);
  
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Đọc dữ liệu từ Realtime Database theo ngày
    const messagesRef = ref(database, 'messages/' + date);
    
    const unsubscribe = onValue(messagesRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = await Promise.all(Object.keys(data).map(async (key) => {
          const message = data[key];
          let imageUrl = null;
          if (message.imageUrl) {
            imageUrl = message.imageUrl;
          }
          return {
            id: key,
            ...message,
            imageUrl,
          };
        }));
        setMessages(messagesArray.reverse());
      } else {
        setMessages([]);
      }
    });
  ss
    return () => unsubscribe();
  }, [date]);
  
  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <View>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <Text>No Image</Text>
      )}
      <TouchableOpacity onPress={() => handleDeleteFile(item.id)}>
        <Image
          source={require('../Icon/xoa.png')}
          style={{ width: 20, height: 20, resizeMode: 'cover' }}
        />
      </TouchableOpacity>
    </View>
  );
  

  const deleteDocument = async (folderPath) => {
    try {
      const folderRef = ref(database, folderPath);
      await remove(folderRef);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Thành công',
        text2: 'Đã xóa tất cả tài liệu của bạn!',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lỗi',
        text2: 'Xóa thất bại!',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
      });
    }
  };

  // const handleDeleteFile = async (fileId) => {
  //   try {
  //     await remove(ref(database, 'files/' + fileId));
  //     Alert.alert('Success', 'File deleted successfully');
  //     setSelectedFile(null); // Clear selected file after deletion
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to delete file: ' + error.message);
  //   }
  // };
  // const handleDeleteFile = async (fileId) => {
  //   try {
  //     // Xóa tài liệu
  //     await remove(ref(database, 'files/' + fileId));
  //     Alert.alert('Success', 'File deleted successfully');
  
  //     // Cập nhật danh sách messages
  //     setMessages((prevMessages) => prevMessages.filter((message) => message.id !== fileId));
  
  //     // Xóa tệp đã chọn
  //     setSelectedFile(null);
  //   } catch (error) {
     
  //     Alert.alert('Error', 'Failed to delete file: ' + error.message);
  //   }
  // };
  const handleDeleteFile = async (fileId) => {
    try {
      const fileRef = ref(database, 'messages/' + date + '/' + fileId);
  
      // Kiểm tra sự tồn tại của tệp trước khi xóa
      onValue(fileRef, (snapshot) => {
        if (snapshot.exists()) {
          remove(fileRef)
            .then(() => {
              // Cập nhật danh sách messages
              setMessages((prevMessages) => prevMessages.filter((message) => message.id !== fileId));
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Thành công',
                text2: 'Xóa thành công!',
                visibilityTime: 5000,
                autoHide: true,
                topOffset: 50,
                bottomOffset: 20,
              });
            })
            .catch((error) => {
              console.error('Error deleting file:', error);
             
            });
        } else {
          
        }
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete file: ' + error.message);
    }
  };
  
  
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa tất cả dữ liệu trong thư mục này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            if (date) {
              await deleteDocument(`messages/${date}`);
              navigation.goBack(); // Quay lại màn hình trước
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  return (
    <View>
      <View style={{flexDirection:'row',margin:25,justifyContent:'space-between'}}>
        <TouchableOpacity onPress={()=>navigation.goBack('WriteThanks')}>
        <Icon name="arrow-back-outline" size={30} color="black"   />
        </TouchableOpacity>
    
        <TouchableOpacity
          onPress={handleDelete}
        >
          <Image
            source={require('../Icon/delete.png')}
            style={{width: 30, height: 30, resizeMode: 'cover'}}
          />
        </TouchableOpacity>

        
      </View>
          <Text style={{fontFamily:'serif',fontSize:20,textAlign:'center'}}>Messages from {date}</Text>
          <FlatList
        style={{ height: '55%', paddingHorizontal: 15, paddingVertical: 10, marginTop: 20 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
        
        <View style={{borderWidth:1,marginHorizontal:15,paddingHorizontal:20,paddingVertical:15,borderRadius:20,marginVertical:30}}>
        <Text>Chọn nhóm để chia sẻ lời cảm ơn?</Text>
        <View style={{height:1,backgroundColor:'#ccc',width:"100%",marginTop:15,}}></View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
          <Image source={require("../Icon/dolingo.png")}
          style={{width:80,height:80,resizeMode:'center'}}/>
          <Text>Cú chăm chỉ - cùng nhau{"\n"}
            học ngoại ngữ Mỗi Ngày
          </Text>
          <CustomCheckbox isChecked={isChecked} onPress={toggleCheckbox} />
        </View>
        <TouchableOpacity>
        <Image source={require("../Icon/plus.png")}
        style={{
          height:40,
          width:40,
          resizeMode:'cover',
          alignSelf:'center',
        }}/>
        </TouchableOpacity>
      
      </View>
      </View>
  )
}

export default ForderThanks

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection:'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent:'space-between',

  },
  messageText: {
    fontSize: 19,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10,
  },
})