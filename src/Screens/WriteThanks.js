import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {ref, set, onValue,remove} from 'firebase/database';
import { storage, database } from './configFirebase'; 
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

import Dialog from 'react-native-dialog';
const CustomCheckbox = ({isChecked, onPress}) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};
//check book

const {width: screenWidth} = Dimensions.get('window');
//lấy kích cỡ màn hình để hiển thị ảnh
const images = [
  require('../ImageBanner/bannerThanks1.png'),
  require('../ImageBanner/bannerThanks2.png'),
  require('../ImageBanner/bannerThanks3.png'),
  require('../ImageBanner/bannerThanks4.png'),
];

// end function
const WriteThanks = ({navigation}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [textInput, setTextInut] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [folder, setfolder] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [folders, setFolders] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  
  const handleSelectImage = async (source) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      selectionLimit: 1,
    };

    setDialogVisible(false);

    if (source === 'camera') {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', response.errorMessage);
        } else {
          setPhoto(response.assets[0].uri);
        }
      });
    } else if (source === 'library') {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', response.errorMessage);
        } else {
          setPhoto(response.assets[0].uri);
        }
      });
    }
  };
  const handleDeletePhoto = () => {
    setPhoto(null);
  };
// take photo
  
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    // Lấy dữ liệu từ Realtime Database
    const messagesRef = ref(database, 'messages');

    const unsubscribe = onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const foldersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setFolders(foldersArray.reverse());
      } else {
        setFolders([]);
      }
    });

    // Dọn dẹp khi component unmount
    return () => unsubscribe();
  }, []);
  // lấy dữ liệu realtime

  const handlePress = () => {
    // Xử lý logic lưu dữ liệu ở đây

    // Đặt TextInput về rỗng
    setText('');
  };

  useEffect(() => {
    // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
    const today = new Date();
    const formattedDate = 
      ('0' + today.getDate()).slice(-2) + '-' + 
      ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
      today.getFullYear();
    setCurrentDate(formattedDate);

    // Đọc dữ liệu từ Realtime Database
    const messagesRef = ref(database, 'messages/' + formattedDate);

    const unsubscribe = onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    // Dọn dẹp khi component unmount
    return () => unsubscribe();
  }, [currentDate]);
  //ngày

  const handleSave = async () => {
    if (text.trim() === '') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Vui lòng nhập lời cảm ơn của bạn?',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
      });
      return;
    }



    try {
      let imageUrl = null;

      if (photo) {
        // Upload image to Firebase Storage
        const response = await fetch(photo);
        const blob = await response.blob();
        const storageReference = storageRef(storage, `images/${Date.now()}`);
        await uploadBytes(storageReference, blob);
        imageUrl = await getDownloadURL(storageReference);
      }
      // Lưu dữ liệu vào Realtime Database dưới folder theo ngày
      await set(ref(database, 'messages/' + currentDate + '/' + Date.now()), {
        message: text,
        timestamp: Date.now(),
        imageUrl: imageUrl, 
      });
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Thành công',
        text2: 'Lưu lời cảm ơn thành công!.',
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 20,
      });
      setText('');
      setPhoto(null);
    } catch (error) {
      Alert.alert('Lỗi', '...: ' + error.message);
    }
  };

  //Lỗi và inport

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
      });
    }, 5000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentImageIndex]);
  // animated ảnh

  const handleTextChange = inputText => {
    // Giới hạn số lượng chữ là 1000 từ
    const wordLimit = 1000;
    const words = inputText.split(/\s+/); // Tách văn bản thành các từ
    if (words.length <= wordLimit) {
      setTextInut(inputText);
    } else {
      // Nếu vượt quá giới hạn, không cập nhật state
      setTextInut(words.slice(0, wordLimit).join(' '));
    }
  };

 
  //input box
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{marginBottom: 20}}>
        
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              alignItems: 'center',
              marginLeft: 10,
            }}>
              <TouchableOpacity onPress={() => navigation.goBack('AllBtn')}>
            <Icon name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                marginLeft: 95,
                fontFamily: 'serif',
              }}>
              Write Thanks
            </Text>
          </View>
       

        {/* end back */}
        <View style={styles.container}>
          <Animated.Image
            source={images[currentImageIndex]}
            style={[styles.image, {opacity: fadeAnim}]}
            resizeMode="cover"
          />
        </View>
        {/* end banner */}

        <Text style={styles.title}>Viết lời cảm ơn hôm nay của bạn</Text>
        {/* end title */}

        <View style={styles.Allinput}>
          <Text
            style={{
              fontSize: 15,
            }}>
            Lời cảm ơn của bạn {'\n'}
            Viết xuống dưới nhé!
            <Image
              style={{width: 20, height: 20, resizeMode: 'center'}}
              source={require('../Icon/handDown.png')}
            />
          </Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Nhập văn bản của bạn..."
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
            />
                {photo ? (
        <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
          <Image
            source={{ uri: photo }}
            style={styles.image1}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePhoto}>
            <Image source={require('../Icon/xoa.png')}
            style={{width:30,height:30}}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{textAlign:'center'}}>Chưa có ảnh nào</Text>
      )}
          </View>
          <Text style={{textAlign: 'right', marginRight: 20}}>
            Số từ: {text.split(/\s+/).length} / 1000
          </Text>
          {/* count text */}

          <View style={styles.foder}>
            <TouchableOpacity onPress={() => setDialogVisible(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 8,
                  borderColor: '#ccc',
                }}>
                <Image
                  source={require('../Icon/labrary.png')}
                  style={{height: 20, width: 20, resizeMode: 'center'}}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'serif',
                    color: 'black',
                    marginLeft: 8,
                  }}>
                  Chọn ảnh
                </Text>
              </View>
              <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Chọn nguồn ảnh</Dialog.Title>
        <Dialog.Button
          label="Chụp ảnh"
          onPress={() => handleSelectImage('camera')}
        />
        <Dialog.Button
          label="Chọn từ thư viện"
          onPress={() => handleSelectImage('library')}
        />
        <Dialog.Button
          label="Hủy"
          onPress={() => setDialogVisible(false)}
          color="red"
        />
      </Dialog.Container>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 8,
                  borderColor: '#ccc',
                }}>
                <Image
                  source={require('../Icon/iconForder.png')}
                  style={{height: 20, width: 20, resizeMode: 'cover'}}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'serif',
                    color: 'black',
                    marginLeft: 8,
                  }}>
                  Lưu
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePress}>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 8,
                  borderColor: '#ccc',
                }}>
                <Image
                  source={require('../Icon/delete.png')}
                  style={{height: 20, width: 20, resizeMode: 'cover'}}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'serif',
                    color: 'black',
                    marginLeft: 8,
                  }}>
                  Xóa
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* end write thanks */}

        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: 15,
            marginVertical: 20,
            height: folder ? 'auto' : 330,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 15}}>
              Những lời cảm ơn bạn đã viết {'\n'}
              Đều ở folder bên dưới nhé!
            </Text>
            <TouchableOpacity onPress={() => setfolder(!folder)}>
              <Text style={{color: '#0085FF'}}>
                {folder ? 'Ẩn bớt' : 'Xem tất cả'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* end title folder */}
          <FlatList
            data={folders}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.messageContainer}
                onPress={() => navigation.navigate('Forder', {date: item.id})}>
                <Image
                  source={require('../Icon/folder.png')}
                  style={{width: 40, height: 40}}
                />
                <Text style={styles.folderText}>{item.id}</Text>
                {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100 }} />
      ) : null}
              </TouchableOpacity>
            )}
           
          />
           <Text style={{textAlign:'center'}}>End folder</Text>

        </View>
        {/* end folder */}

        <View
          style={{
            borderWidth: 1,
            marginHorizontal: 15,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 20,
            marginBottom: 30,
          }}>
          <Text>Chọn nhóm để chia sẻ lời cảm ơn?</Text>
          <View
            style={{
              height: 1,
              backgroundColor: '#ccc',
              width: '100%',
              marginTop: 15,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Image
              source={require('../Icon/dolingo.png')}
              style={{width: 80, height: 80, resizeMode: 'center'}}
            />
            <Text>
              Cú chăm chỉ - cùng nhau{'\n'}
              học ngoại ngữ Mỗi Ngày
            </Text>
            <CustomCheckbox isChecked={isChecked} onPress={toggleCheckbox} />
          </View>
        </View>
        {/* end share */}
      </ScrollView>
    </View>
  );
};

export default WriteThanks;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 200, // Chiều cao của banner
    overflow: 'hidden', // Đảm bảo nội dung không bị tràn ra ngoài
    borderRadius: 5,
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontFamily: 'serif',
    textAlign: 'center',
    fontWeight: '700',
    color: 'black',
  },
  Allinput: {
    borderWidth: 1,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    borderColor: '#ccc',
    backgroundColor: 'white',
    // shadow
    shadowColor: '#000',
    shadowOffset: {with: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    height:'auto',
    paddingHorizontal: 5,
  },
  foder: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 10,
  },
  checked: {
    backgroundColor: 'green',
  },
  checkmark: {
    color: 'white',
    fontSize: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  folderText: {
    fontSize: 15,
    color: 'red',
    marginLeft: 10,
  },
  image1: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    alignSelf:'center',
    marginBottom:20,
    marginLeft:40
  },
});
