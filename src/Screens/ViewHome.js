import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

const texts = [
  'Cuộc sống ngắn ngủi, hãy trân trọng mỗi giây phút của nó.',
  'Cách để bắt đầu là ngừng nói và bắt đầu làm.” – Walt Disney',
  '“Hãy yêu cuộc đời mình để không phải hối tiếc khi nó trôi qua.” – Thích Nhất Hạnh',
  'Thành công không phải là không có thất bại mà là sự kiên trì vượt qua thất bại.” – Aisha Tyler',
];

const ViewHome = ({navigation}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    }, 5000); // Thay đổi đoạn văn bản mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentTextIndex]);

  //run write
  return (
    
    <View style={{flex:1}}>
      <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 20,
        }}>
        <Image
          source={require('../ImageAsman/LogoAsm.png')}
          style={{width: 55, height: 55}}
        />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity>
            <Image
              source={require('../Icon/searches.png')}
              style={{width: 25, height: 25, resizeMode: 'cover'}}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../Icon/bell.png')}
              style={{
                width: 25,
                height: 25,
                marginLeft: 10,
                resizeMode: 'cover',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../Icon/user1.png')}
              style={{
                width: 25,
                height: 25,
                marginLeft: 10,
                resizeMode: 'cover',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* end Tùy chỉnh */}
      <View style={styles.container}>
        <Animated.Text style={[styles.text, {opacity: fadeAnim}]}>
          {texts[currentTextIndex]}
        </Animated.Text>
      </View>
      {/* end animated */}

      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          color: 'red',
          marginTop: 30,
          marginLeft: 20,
        }}>
        Bắt đầu luyện tập
      </Text>
      <Text
        style={{
          marginLeft: 20,
          color: 'black',
          fontSize: 15,
          color: 'green',
        }}>
        Với những mục tiêu hôm nay thôi nào
      </Text>
      {/* end title */}

      <View style={styles.containerSearch}>
        <Image
          source={require('../Icon/searches.png')}
          style={{width: 25, height: 25,marginHorizontal:8}}
        />
        <TextInput placeholder="Tìm bài tập" />
      </View>
      {/* end search */}

      <TouchableOpacity style={{marginTop:20}}>
        <View style={styles.containerItem1}>
          <View style={{width: '55%', marginLeft: 30, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: 18,
                color: 'white',
              }}>
              Chạy bộ{'\n'}
            </Text>
            <Text style={{color: 'white'}}>
              Người đã tham gia trải nghiệm thói quen này!
            </Text>
          </View>
          <Image
            source={require('../ImageAsman/walk.png')}
            style={{width: 100, height: 150,marginLeft:20}}
          />
        </View>
      </TouchableOpacity>
{/* end walk */}
      
      <TouchableOpacity onPress={()=>navigation.navigate('WriteThanks')}>
        <View style={styles.containerItem2}>
        <Image
            source={require('../ImageAsman/seatdown.png')}
            style={{width: 100, height: 100,marginLeft:10,marginTop:25}}
          />
          <View style={{width: '55%', marginLeft: 30, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: 18,
                color: 'white',
              }}>
              Viết lời cảm ơn{'\n'}
            </Text>
            <Text style={{color: 'white'}}>
              Người đã tham gia trải nghiệm thói quen này!
            </Text>
          </View>
         
        </View>
      </TouchableOpacity>
      {/* end write */}

      <TouchableOpacity onPress={()=> navigation.navigate('BMI')}>
        <View style={styles.containerItem3}>
          <View style={{width: '55%', marginLeft: 30, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: 18,
                color: 'white',
              }}>
              Ăn uống{'\n'}
            </Text>
            <Text style={{color: 'white'}}>
              Người đã tham gia trải nghiệm thói quen này!
            </Text>
          </View>
          <Image
            source={require('../ImageAsman/eat.png')}
            style={{width: 110, height: 110,marginLeft:10,marginTop:20}}
          />
        </View>
      </TouchableOpacity>
      {/* end eat */}

            
      <TouchableOpacity onPress={()=> navigation.navigate('Focus')}>
        <View style={styles.containerItem4}>
        <Image
            source={require('../ImageAsman/learning.png')}
            style={{width: 110, height: 110,marginLeft:20,marginTop:29}}
          />
          <View style={{width: '55%', marginLeft: 10, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: 18,
                color: 'white',
              }}>
              Tập trung{'\n'}
            </Text>
            <Text style={{color: 'white'}}>
              Người đã tham gia trải nghiệm thói quen này!
            </Text>
          </View>
         
        </View>
      </TouchableOpacity>
{/* end save */}

<TouchableOpacity>
        <View style={styles.containerItem3}>
          <View style={{width: '55%', marginLeft: 30, marginTop: 10}}>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: 18,
                color: 'white',
              }}>
              Sức khỏe và Tinh thần{'\n'}
            </Text>
            <Text style={{color: 'white'}}>
              Người đã tham gia trải nghiệm thói quen này!
            </Text>
          </View>
          <Image
            source={require('../ImageAsman/yoga.png')}
            style={{width: 110, height: 120,marginLeft:10,marginTop:10}}
          />
        </View>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ViewHome;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 500,
    color: 'black',
    textAlign: 'center',
  },
  containerSearch: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderRadius: 15,
    borderWidth: 1,
  },
  containerItem1: {
    flexDirection: 'row',
    backgroundColor: '#3300FF',
    borderRadius: 20,
    height: 110,
    marginHorizontal: 20,
    marginBottom:40
  },
  containerItem2: {
    flexDirection: 'row',
    backgroundColor: '#3366FF',
    borderRadius: 20,
    height: 110,
    marginHorizontal: 20,
    marginBottom:40
  },
  containerItem3: {
    flexDirection: 'row',
    backgroundColor: '#669900',
    borderRadius: 20,
    height: 110,
    marginHorizontal: 20,
    marginBottom:40
  },
  containerItem4: {
    flexDirection: 'row',
    backgroundColor: '#339900',
    borderRadius: 20,
    height: 110,
    marginHorizontal: 20,
    marginBottom:40
  },
  
});
