import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Animated,  Dimensions, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
const ViewFocus = ({navigation}) => {
  const [selectedTime, setSelectedTime] = useState(0); // thời gian chọn (giây)
  const [remainingTime, setRemainingTime] = useState(0); // thời gian còn lại
  const [isRunning, setIsRunning] = useState(false); // trạng thái chạy
  const [music, setmusic] = useState(true)
  const [isDropdownVisible, setDropdownVisible] = useState(false); // trạng thái hiển thị dropdown
  const [selectedLabel, setSelectedLabel] = useState('Chọn thời gian'); // nhãn cho thời gian đã chọn
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false); // trạng thái hiển thị modal xác nhận

  const timeOptions = [
    { label: '10 minutes', value: 600 },
    { label: '20 minutes', value: 1200 },
    { label: '30 minutes', value: 1800 },
  ];

  const texts = [
    "Don't look at me",
    "Stay focused!",
    "Hang in there!",
    "Put down your phone. Please!",
    "What you plan now",
    "You are almost there",
    "keep up the good work",
    "You can do it!",
    "Dont't give up!",
  ];

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
        setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
      });
    }, 6000); 

    return () => clearInterval(interval); 
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentTextIndex]);

  useEffect(() => {
    let timer;
    if (isRunning && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, remainingTime]);

  const selectTime = (time,label) => {
    setSelectedTime(time);
    setRemainingTime(time);
    setSelectedLabel(label);
    setIsRunning(false); // Đảm bảo rằng hẹn giờ không tự động chạy
    setDropdownVisible(false); // Đóng dropdown sau khi chọn
    setDropdownVisible(false); 
  };

  const handleStartStop = () => {
    if (selectedTime === 0) {
      // Hiển thị cảnh báo nếu chưa chọn thời gian
        Alert.alert("Lỗi"
          ,'chọn thời gian bạn muốn học?')
      return;
    }
    if (isRunning) {
      setConfirmModalVisible(true); // Hiển thị modal xác nhận
    } else {
      setIsRunning(true);
    }
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setIsRunning(false); // Dừng lại nếu người dùng chọn "Có"
    }
    setConfirmModalVisible(false); // Đóng modal xác nhận
  };

  const stopTimer = () => {
    setIsRunning(false);
    setRemainingTime(selectedTime); 
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
       <View style={{flexDirection:"row", marginTop:15, alignItems:'center',margin:20,justifyContent:'space-between'}}>
        <TouchableOpacity onPress={()=>{navigation.goBack('Home')}}>
            <Icon name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
            <Text style={{fontSize:25, color:'black', textAlign:'center', fontFamily:'serif'}}>Focus</Text>
            <Image style={{width:40,height:40}}
             source={music ? require("../Icon/no-headphones.png") : require("../Icon/headphones.png")}/>
          </View>
          {/* end tab */}
          <View style={{alignSelf:'center',marginTop:80}}>
            <Animated.Text style={[styles.text, {opacity: fadeAnim}]}>
            {texts[currentTextIndex]}
        </Animated.Text>
        {/* annimated */}
      </View>
          <View style={{marginTop:80}}>
          <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
          </View>
          {/* end time */}
          <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownVisible(true)}
            >
              <Image style={{width:16,height:16,marginRight:10}}
               source={require("../Icon/update.png")}/>
              <Text style={styles.dropdownText}>{selectedLabel}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isDropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={timeOptions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => selectTime(item.value, item.label)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.label}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity style={styles.controlButton} onPress={handleStartStop}>
        <Image source={isRunning ? require("../Icon/power-on1.png") : require("../Icon/power-on.png")}/>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isConfirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontSize:15,color:'black',fontWeight:600,textAlign:'center'}}>Are You Sure To Give Up ?</Text>
            <View style={styles.confirmButtons}>
                 <TouchableOpacity style={{padding:8,backgroundColor:"#ccc",borderRadius:5,width:'40%'}} onPress={()=>handleConfirm(false)}>
                <Text style={{textAlign:"center",color:"white"}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:8,backgroundColor:"red",borderRadius:5,width:'40%'}} onPress={()=>handleConfirm(true)}>
                <Text style={{textAlign:"center",color:"white"}}>Give Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
{/* 
      <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
        <Text style={styles.stopButtonText}>Reset</Text>
      </TouchableOpacity> */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#00CC66',
  },
  timerText: {
    fontSize: 120,
    marginBottom: 20,
    textAlign:'center',
  },

  controlButton: {
    marginTop:40,
    alignSelf:'center',
    backgroundColor:'#ccc',
    padding: 20,
    borderRadius: 55,
    marginBottom: 10,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 18,
  },
  dropdown: {
    flexDirection:'row',
    alignItems:'center',
    marginTop:20,
    padding: 10,
    alignSelf:'center',
    borderRadius: 5,
   
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
    fontFamily:'serif',
     textAlign:'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ để làm nổi bật modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10, // Bo góc cho modal
    padding: 20,
    shadowColor: '#000', // Tạo bóng đổ cho modal
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Đường gạch chân giữa các tùy chọn
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    padding: 10,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily:"serif"
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ViewFocus;
