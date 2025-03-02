
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Modal, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push,onValue } from 'firebase/database';
import { FlatList } from 'react-native-gesture-handler';
const firebaseConfig = { 
  apiKey: "AIzaSyBv4e9qwh1rbdVrrZq4vh9ysgpAggJgGMY",
  authDomain: "asmreact-126fe.firebaseapp.com",
  projectId: "asmreact-126fe",
  storageBucket: "asmreact-126fe.appspot.com",
  messagingSenderId: "231481421846",
  appId: "1:231481421846:web:0553a77c693ebff4d8c537",
  measurementId: "G-EFNZ26Z2VG",
  databaseURL: "https://asmreact-126fe-default-rtdb.firebaseio.com"
};
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ViewBMI = ({ navigation }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBMICategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [bmiRecords, setBmiRecords] = useState([]);


  useEffect(() => {
    const bmiRef = ref(database, 'bmiRecords/');

    // Lắng nghe thay đổi dữ liệu
    const unsubscribe = onValue(bmiRef, (snapshot) => {
      const data = snapshot.val();
      const records = data ? Object.values(data) : [];
      setBmiRecords(records);
    });

    return () => unsubscribe();
  }, []);
  
  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;
  
    if (isNaN(weightNum) || isNaN(heightNum) || !weightNum || !heightNum || !age) {
      Alert.alert("Lỗi",'Vui lòng nhập đầy đủ thông tin hợp lệ.');
      return;   
    }
  
    // Tính BMI
    const bmiValue = weightNum / (heightNum * heightNum);
    setBMI(bmiValue.toFixed(1));
  
    // Xác định loại BMI
    let category = '';
    if (bmiValue < 18.5) {
      category = 'Thiếu cân';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      category = 'Bình thường';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      category = 'Thừa cân';
    } else {
      category = 'Béo phì';
    }
    setBMICategory(category);
  
     // Lưu dữ liệu lên Firebase Realtime Database
  const bmiData = {
    bmi: bmiValue.toFixed(1),
    category,
    timestamp: Date.now(),  // Times hiện tại
  };

  const bmiRef = ref(database, 'bmiRecords/'); 

  push(bmiRef, bmiData)
    .then(() => console.log('BMI data saved successfully.'))
    .catch(error => console.error('Error saving BMI data: ', error));

  };

  const openModal = () => {
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const openReminderModal = () => {
    setReminderModalVisible(true);
  };
  
  const closeReminderModal = () => {
    setReminderModalVisible(false);
  };

  const setReload = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setBMI(null); 
    setBMICategory(''); ss
  }

  const showModal = () => {
    let message = '';
    if (bmiCategory === 'Thiếu cân') {
      message = `     Dưới đây là các bước chính để tăng cân:

        1.Ăn nhiều bữa nhỏ: Thay vì ba bữa lớn, ăn nhiều bữa nhỏ trong ngày.
        2.Tăng calo: Tiêu thụ thực phẩm giàu calo như các loại hạt, bơ, và trái cây khô.
        3.Ăn nhiều protein: Bổ sung protein từ thịt, cá, trứng, và đậu.
        4.Tập thể dục sức mạnh: Xây dựng cơ bắp bằng cách tập nâng tạ.
        5.Sử dụng thực phẩm bổ sung: Cân nhắc protein shakes hoặc thực phẩm bổ sung calo.
        6.Ăn chất béo lành mạnh: Chọn dầu ô liu, bơ, và quả bơ.
        7.Theo dõi dinh dưỡng: Theo dõi lượng calo và dinh dưỡng.
        8.Ngủ đủ giấc: Đảm bảo giấc ngủ đầy đủ và chất lượng.
        9.Tìm kiếm sự tư vấn từ chuyên gia nếu cần thiết.
      `;
    } else if (bmiCategory === 'Bình thường') {
      message = `Dưới đây là tóm tắt ngắn gọn về chế độ ăn uống và tập luyện thể dục:

                        Chế Độ Ăn Uống
        1.Ăn Đủ Cân Bằng: Kết hợp protein, carbohydrate, và chất béo lành mạnh.
        2.Ưu Tiên Rau Củ Quả: Ăn nhiều rau củ và trái cây.
        3.Chọn Ngũ Cốc Nguyên Hạt: Sử dụng ngũ cốc nguyên hạt.
        4.Uống Đủ Nước: Ít nhất 8 ly nước mỗi ngày.
        5.Hạn Chế Đường và Muối: Giảm lượng đường và muối.
        6.Ăn Thực Phẩm Tươi: Ưu tiên thực phẩm tươi sống.


                        Tập Luyện Thể Dục
        1.Tập Thể Dục Đều Đặn: Ít nhất 150 phút mỗi tuần.
        2.Kết Hợp Các Loại Tập Luyện: Bao gồm aerobic, sức mạnh, và kéo dãn.
        3.Tập Trung Vào Kỹ Thuật: Đảm bảo thực hiện đúng kỹ thuật.
        4.Tăng Cường Độ Dần Dần: Tăng cường độ và khối lượng từ từ.
        5.Nghe Theo Cơ Thể: Nghỉ ngơi nếu cần.
        6.Tìm Sự Thích Thú: Chọn hoạt động bạn yêu thích.`;
    } else if (bmiCategory === 'Thừa cân') {
      message = `Lời khuyên chi tiết hơn cho người thừa cân:

      1.Ăn Lành Mạnh: Chọn thực phẩm tươi, ít calo như rau củ, trái cây, và protein nạc. Tránh thực phẩm chế biến sẵn và nhiều đường.

      2.Tập Thể Dục Đều Đặn: Cố gắng tập luyện ít nhất 150 phút mỗi tuần, bao gồm cả bài tập aerobic (như đi bộ nhanh, bơi lội) và tập sức mạnh (như nâng tạ).

      3.Uống Đủ Nước: Uống đủ nước hàng ngày để hỗ trợ trao đổi chất và kiểm soát cơn đói. Hạn chế đồ uống có đường và calo cao.

      4.Ăn Chậm và Điều Độ: Ăn từ từ, nhai kỹ và lắng nghe cơ thể để cảm nhận khi đã đủ no. Tránh ăn khuya hoặc ăn khi không đói.

      5.Ngủ Đủ Giấc: Đảm bảo ngủ từ 7-9 giờ mỗi đêm để giúp cơ thể phục hồi và điều chỉnh hormone liên quan đến cân nặng.

      6.Theo Dõi Tiến Trình: Ghi chép thực phẩm ăn uống và theo dõi cân nặng để nhận biết xu hướng và điều chỉnh kế hoạch khi cần.

      7.Tìm Sự Hỗ Trợ: Nếu cần, hãy tìm kiếm sự tư vấn từ bác sĩ hoặc chuyên gia dinh dưỡng để có kế hoạch giảm cân phù hợp và an toàn.`;
    } else if (bmiCategory === 'Béo phì') {
      message = `   lời khuyên dành cho người béo phì:

      1.Tìm Kiếm Sự Tư Vấn: Hãy gặp bác sĩ hoặc chuyên gia dinh dưỡng để xây dựng kế hoạch giảm cân an toàn và hiệu quả.

      2.Ăn Lành Mạnh: Chọn thực phẩm giàu dinh dưỡng như rau củ, trái cây, và protein nạc. Giảm tiêu thụ thực phẩm nhiều calo, đường, và chất béo bão hòa.

      3.Tập Thể Dục Đều Đặn: Đặt mục tiêu tập luyện ít nhất 150 phút mỗi tuần với các bài tập aerobic và sức mạnh. Bắt đầu từ từ và tăng dần cường độ.

      4.Uống Đủ Nước: Uống nước thay vì đồ uống có đường. Nước giúp kiểm soát cơn đói và hỗ trợ trao đổi chất.

      5.Theo Dõi Thực Phẩm và Tiến Trình: Ghi chép lượng calo và thực phẩm tiêu thụ hàng ngày để theo dõi sự tiến bộ và điều chỉnh khi cần.

      6.Ngủ Đủ Giấc: Ngủ từ 7-9 giờ mỗi đêm để cải thiện sức khỏe tổng thể và hỗ trợ quá trình giảm cân.

      7.Quản Lý Căng Thẳng: Tìm cách giảm căng thẳng qua các hoạt động thư giãn như yoga, thiền, hoặc các sở thích cá nhân.

      8.Xây Dựng Thói Quen Tốt: Tạo và duy trì các thói quen ăn uống và tập luyện lành mạnh để duy trì cân nặng lâu dài.

      9.Tìm Sự Hỗ Trợ: Tham gia các nhóm hỗ trợ hoặc các cộng đồng giảm cân để có động lực và chia sẻ kinh nghiệm.`;
    }
    // console.log("đây là consolog",message)
    if(message===""){
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Thất bại',
        text2: ' Bạn hãy thực hiện tính toán BMI trước!',
      });
    }else{
      setModalMessage(message);
      setReminderModalVisible(true);
    }
  };

  // useEffect(() => {
  //   if (weight && height && age) {
  //     calculateBMI();
  //   }
  // }, [weight, height, age]);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#ccc',padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <TouchableOpacity onPress={() => navigation.push('AllBtn')}>
          <Icon name="arrow-back-outline" size={30} color="black" />
          {/* <Text style={{ fontSize: 15, color: 'black', marginLeft: 20, fontFamily: 'serif' }}>Back to Home</Text> */}
      </TouchableOpacity >
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={setReload}>
      <Image style={{height:25,width:25,marginTop:5,marginRight:10}}
       source={require('../Icon/reload.png')}/>
        </TouchableOpacity>


        <TouchableOpacity onPress={openModal}>
      <Image style={{height:35,width:35,resizeMode:'contain'}}
       source={require('../Icon/fast-time.png')}/>
        </TouchableOpacity>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalTitle1}>Kết quả BMI</Text>
        
            <FlatList
              data={bmiRecords}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.recordItem1}>
                  <Text>Chỉ số BMI: {item.bmi}</Text>
                  <Text>Phân loại: {item.category}</Text>
                  <Text>Thời gian: {new Date(item.timestamp).toLocaleString()}</Text>
                </View>
              )}
            />
                <Button title="Đóng" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      </View>
      </View>
      <View style={{marginHorizontal:20}}>

      <Text style={styles.title}>Bảng tính chỉ số BMI</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',marginBottom:20,}}>
        <View style={{width: '30%',}}>
          <Text style={{textAlign:'center',color:'black'}}>Nhập độ tuổi</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          //  placeholder='number'
          value={age}
          onChangeText={setAge}
        />
        </View>

        <View style={{width: '30%'}}>
          <Text style={{textAlign:'center',color:'black'}}>Nhập cân nặng</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          //  placeholder='kg'
          value={weight}
          onChangeText={setWeight}
        />
        </View>
        <View style={{width: '30%',}}>
          <Text style={{textAlign:'center',color:'black'}}>Nhập chiều cao</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          // placeholder='cm'
          value={height}
          onChangeText={setHeight}
        />
        </View>
      </View>
      <Image style={{height:250,width:'auto',resizeMode:'contain'}}
       source={require('../ImageAsman/protein.png')}/>
    <View style={{marginTop:20}}>
      {bmi !== null && (
        <View style={styles.resultBMI}>
          <View style={{ alignItems: 'center' }}>
            <Text>Chỉ số BMI</Text>
            <Text style={styles.resultText}>{bmi}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>Phân loại:</Text>
            <Text style={styles.resultText}>{bmiCategory}</Text>
          </View>
        </View>
      )}

    </View>

     <TouchableOpacity onPress={calculateBMI}
     style={{backgroundColor:'#FFCC66',alignItems:'center',padding:10,borderRadius:10}}
     >
      <Text style={{color:'white',fontWeight:600}}>Tính BMI</Text>
     </TouchableOpacity>
      
      <Text style={{textAlign:'center',marginTop:10}}>Ghi chú</Text>

      <View>
        <View style={[styles.noteItem, bmiCategory === 'Thiếu cân' && styles.activeNote]}>
          <Text style={{color:'#0099FF'}}>Thiếu cân</Text>
          <Text style={{color:'#0099FF'}}> 15.9 - 18.5  </Text>
        </View>
        <View style={[styles.noteItem, bmiCategory === 'Bình thường' && styles.activeNote]}>
          <Text style={{color:'green'}}>Bình thường</Text>
          <Text style={{color:'green'}}> 18.5 - 25.0 </Text>
        </View>
        <View style={[styles.noteItem, bmiCategory === 'Thừa cân' && styles.activeNote]}>
          <Text style={{color:'red'}}>Thừa cân</Text>
          <Text style={{color:'red'}}> 25.0 - 29.9 </Text>
        </View>
        <View style={[styles.noteItem, bmiCategory === 'Béo phì' && styles.activeNote]}>
          <Text style={{color:'red'}}>Béo phì</Text>
          <Text style={{color:'red'}}> 30.0+ </Text>
        </View>
      </View>

      <TouchableOpacity onPress={showModal}
       style={{flexDirection:'row',alignSelf:'center',width:"32%",backgroundColor:"#33CC66",padding:8,borderRadius:5,alignItems:'center',marginTop:10}}>
        <Image style={{width:20,height:20,}}
        source={require('../Icon/book.png')}/>
          <Text style={{fontFamily:'serif',fontSize:15,color:'white',marginLeft:5}}>Nhắc nhở</Text>
      </TouchableOpacity>
      <Modal
          animationType="slide"
          transparent={true}
          visible={reminderModalVisible}
          onRequestClose={closeReminderModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalMessage}</Text>

              <TouchableOpacity style={{flexDirection:'row',alignItems:'center',backgroundColor:'#33CC00',padding:10,borderRadius:15,marginBottom:10,}}>
                <Image style={{height:30,width:30}}
                source={require('../Icon/speech-bubble.png')}/>
                <Text style={{color:'white'}}>Hỗ trợ 24/7{"\n"}
                  Trò chuyện với BS Dinh Dưỡng
                </Text>
              </TouchableOpacity>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={closeReminderModal}
              >
                <Text style={styles.textStyle}>Đóng</Text>
              </Pressable>
            </View>
          </View>
      </Modal>


      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 20
  },
  input: {
    height:40,
    width:"100%",
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
    textAlign:'center'
  },
  resultBMI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
    color: 'green'
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    
    
  },
  activeNote: {
    backgroundColor: '#d3d3d3',

  },
  reminderButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '32%',
    backgroundColor: '#33CC66',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  reminderText: {
    fontFamily: 'serif',
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent1: {
    width: '80%',
    height:'80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText1: {
    fontSize: 18,
    marginBottom: 10,
  },
  recordItem1: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom:10
  },
});

export default ViewBMI;
