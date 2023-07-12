import * as React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from 'react-native';

import Title from '../components/TitlePage';
import { useSettings } from '../hooks/useSettings';
import SwitchBlock from '../components/SwitchBlock';
import * as ImagePicker from 'expo-image-picker';

import { useWallet } from '../contexts/WalletContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import SubtitleBlock from '../components/SubtitleBlock';
import NewsBlock from '../components/NewsBlock';
import PerksBlock from '../components/PerksBlock';
import ImgProfile from '../components/ImgProfile';
const TEST_NEWS = [
  {
    id: '1',
    name: 'Cafe',
    img: require('../assets/test_img/news_1.png'),
    count: '7',
  },
  {
    id: '2',
    name: 'Conference',
    img: require('../assets/test_img/news_2.png'),
    count: '4',
  },
  {
    id: '3',
    name: 'Conference',
    img: require('../assets/test_img/news_3.png'),
    count: '4',
  },
];

const TEST_PERKS = [
  {
    id: '1',
    title: 'Cup of coffee',
    name: 'Cafe “Almare”',
    img: require('../assets/test_img/perk_1.png'),
    time: '22h left',
    count: '4',
  },
  {
    id: '2',
    title: 'Free burger',
    name: 'KFC”',
    img: require('../assets/test_img/perk_2.png'),
    time: '12h left',
  },
  {
    id: '3',
    title: 'Boat trip',
    name: 'Cafe “Almare””',
    img: require('../assets/test_img/perk_3.png'),
    time: '7h left',
    count: '2',
  },
  {
    id: '1',
    title: 'Cup of coffee',
    name: 'Cafe “Almare”',
    img: require('../assets/test_img/perk_1.png'),
    time: '22h left',
  },
  {
    id: '2',
    title: 'Free burger',
    name: 'KFC”',
    img: require('../assets/test_img/perk_2.png'),
    time: '12h left',
  },
  {
    id: '3',
    title: 'Boat trip',
    name: 'Cafe “Almare””',
    img: require('../assets/test_img/perk_3.png'),
    time: '7h left',
  },
];

const ProfileScreen: React.FC<BottomTabBarProps> = ({ navigation }) => {
  const { userName, changeUserName } = useSettings();
  const { isOwnerViewPreferred, changeIsOwnerViewPreferred } = useSettings();
  const userNameInputRef = React.useRef<any>();
  const [image, setImage] = useState(null || '');
  const [isSmallImg, setisSmallImg] = useState(false);
  const { disconnect } = useWallet();

  const { isConnected: isWalletConnected } = useWallet();
  function handleDisconnectPress() {
    disconnect();
    navigation.navigate('WelcomeScreen');
  }

  function handleBack() {
    navigation.navigate('CameraScreen');
  }
  function handleWhatsNext() {
    navigation.navigate('WhatNextScreen');
  }
  React.useEffect(() => {}, [userName, isSmallImg]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const resetImg = () => {
    setImage('');
  };
  const handleOnScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 180) {
      setisSmallImg(true);
    } else {
      setisSmallImg(false);
    }
  };
  return (
    <>
      <ScrollView onScroll={(e) => handleOnScroll(e)} style={styles.infoScreenWrapperInfoScreen}>
        {/* title */}
        <View style={styles.wrapperTitleInfoScreen}>
          <View style={styles.profileTitle}>
            <TouchableHighlight
              underlayColor="transparent"
              activeOpacity={0.5}
              onPress={handleBack}
              style={styles.arrowLeftTitleProfile}>
              <Image
                style={styles.shareImgInfoScreen}
                resizeMode="contain"
                source={require('../assets/arrow_left.png')}
              />
            </TouchableHighlight>
            <Title label="Profile" />
          </View>

          <TouchableHighlight
            underlayColor="transparent"
            activeOpacity={0.5}
            onPress={handleDisconnectPress}
            style={styles.shareInfoScreen}>
            <Image
              style={styles.shareImgInfoScreen}
              resizeMode="contain"
              source={require('../assets/exit.png')}
            />
          </TouchableHighlight>
        </View>
        {/* choise  img*/}

        <ImgProfile pickImage={pickImage} resetImg={resetImg} image={image} />
        {/* choise img */}
        {/* enter name */}
        <View style={styles.nameParametersInfoScreen}>
          {image && isSmallImg && (
            <Image style={styles.nameParametersImg} resizeMode="contain" source={{ uri: image }} />
          )}

          <TextInput
            ref={userNameInputRef}
            numberOfLines={1}
            placeholder="Enter your name"
            value={userName}
            maxLength={20}
            onChangeText={changeUserName}
            style={styles.valueInfoScreen}
          />
          <TouchableHighlight
            underlayColor="transparent"
            activeOpacity={0.5}
            style={styles.shareInfoScreen}>
            <Image
              style={styles.shareImgInfoScreen}
              resizeMode="contain"
              source={require('../assets/icon_connect.png')}
            />
          </TouchableHighlight>
        </View>
        {/* always start */}
        <SwitchBlock
          parameters="Always start from this page"
          onPress={changeIsOwnerViewPreferred}
          isPress={isOwnerViewPreferred}
        />
        {/* can get in */}
        <View style={styles.nameParametersInfoScreen}>
          <Text style={styles.profileGetIn}>Can get in</Text>
          <View style={styles.canGetInTime}>
            <Text style={styles.profileGetInTime}>3 min</Text>
            <TouchableHighlight
              underlayColor="transparent"
              activeOpacity={0.5}
              style={styles.shareInfoScreen}>
              <Image
                style={styles.shareImgInfoScreen}
                resizeMode="contain"
                source={require('../assets/arrow_right.png')}
              />
            </TouchableHighlight>
          </View>
        </View>
        {/* subtitle */}
        <SubtitleBlock label="Latest news" />
        <NewsBlock news={TEST_NEWS} />
        {/* subtitle */}
        <SubtitleBlock label="My Perks" />
        {/* perks */}
        <PerksBlock perks={TEST_PERKS} />

        {/* finally btn */}
        <TouchableHighlight
          onPress={handleWhatsNext}
          style={styles.nextBtn}
          underlayColor="transparent"
          activeOpacity={0.5}>
          <Text style={styles.nextBtnText}>What’s next?</Text>
        </TouchableHighlight>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  infoScreenWrapperInfoScreen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: 10,
    marginBottom: 60,
    backgroundColor: '#F6F7F8',
  },

  profileTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowLeftTitleProfile: {
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
    marginRight: 10,
  },

  wrapperTitleInfoScreen: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 7,
    paddingRight: 7,
  },
  shareInfoScreen: {
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
  },
  shareImgInfoScreen: {
    width: 24,
    height: 24,
  },

  //   name
  nameParametersInfoScreen: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  nameParametersImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  valueInfoScreen: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
    color: '#222222',
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
    textAlign: 'left',
    width: '80%',
  },
  //   name
  //   can get in text
  canGetInTime: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileGetIn: {
    fontSize: 14,
    fontWeight: '400',
  },
  profileGetInTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  //   can get in text

  //   finally btn
  nextBtn: {
    backgroundColor: 'transparent',
    borderColor: '#14C58B',
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderRadius: 50,
    marginBottom: 20,
  },
  nextBtnText: {
    color: '#14C58B',
    fontSize: 14,

    fontWeight: '600',
  },
  //   finally btn
});

export default ProfileScreen;
