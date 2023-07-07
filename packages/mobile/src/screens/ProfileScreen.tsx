import * as React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  Platform,
  TextInput,
  FlatList,
  ScrollView,
  Button,
} from 'react-native';

import { FontFamily } from '../GlobalStyles';
import Title from '../components/TitlePage';
import { useSettings } from '../hooks/useSettings';
import SwitchBlock from '../components/SwitchBlock';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
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
  const isFocused = useIsFocused();
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
    navigation.goBack();
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
        <View style={styles.profileImgBlock}>
          {!image && (
            <TouchableHighlight
              underlayColor="#fff"
              activeOpacity={0.5}
              style={styles.buttonChoiseProfileImg}
              onPress={pickImage}>
              <Image
                style={styles.choiseProfileImg}
                resizeMode="cover"
                source={require('../assets/camera.png')}
              />
            </TouchableHighlight>
          )}

          {image && (
            <View style={styles.choiseImgBlock}>
              <Image resizeMode="cover" source={{ uri: image }} style={styles.profileImg} />
              <View style={styles.deleteImgLayer1}>
                <TouchableHighlight
                  underlayColor="#fff"
                  activeOpacity={0.5}
                  style={styles.deleteImgLayer2}
                  onPress={resetImg}>
                  <Image
                    style={styles.deleteImg}
                    resizeMode="cover"
                    source={require('../assets/trash.png')}
                  />
                </TouchableHighlight>
              </View>
            </View>
          )}
        </View>
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
        <View style={styles.profileSubtitle}>
          <Text style={styles.profileSubtitleText}>Latest news</Text>
        </View>
        {/* latest news */}
        <View style={styles.profileNews}>
          {TEST_NEWS.map((x, i) => (
            <View style={styles.newsItem} key={i}>
              <View style={styles.newsImgBlock}>
                <Image style={styles.newsImg} resizeMode="contain" source={x.img} />
                <View style={styles.newsBlockCounter}>
                  <Text style={styles.newsCounter}>{x.count}</Text>
                </View>
              </View>
              <View style={styles.newsBlockLabel}>
                <Text style={styles.newsLabel}>{x.name}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* subtitle */}
        <View style={styles.profileSubtitle}>
          <Text style={styles.profileSubtitleText}>My Perks</Text>
        </View>
        {/* perks */}
        <View style={styles.profileNews}>
          {TEST_PERKS.map((x, i) => (
            <View style={styles.perksItem} key={i}>
              <View style={styles.perksImgBlock}>
                <Image style={styles.perksImg} resizeMode="contain" source={x.img} />
                {x.count ? (
                  <View style={styles.perksBlockCounter}>
                    <Text style={styles.perksCounter}>x{x.count}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.perksBlockInfo}>
                <Text style={styles.perksLabel}>{x.title}</Text>
                <Text style={styles.perksName}>{x.name}</Text>
                <Text style={styles.perksTime}>{x.time}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* finally btn */}
        <TouchableHighlight style={styles.nextBtn} underlayColor="transparent" activeOpacity={0.5}>
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
  //img
  profileImgBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    minHeight: 68,
    maxHeight: 180,
    justifyContent: 'center',
    marginBottom: 10,
  },
  linearGradientProfileImg: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonChoiseProfileImg: {
    backgroundColor: '#fff',
    width: 180,
    height: 180,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 90,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  choiseProfileImg: {
    width: 50,
    height: 42,
  },
  buttonTextProfileImg: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  choiseImgBlock: {
    width: 180,
    height: 180,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 90,
  },

  profileImg: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  deleteImgLayer1: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 25,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  deleteImgLayer2: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteImg: {
    width: 24,
    height: 24,
  },
  //   img
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  //   name
  //   can get in text
  canGetInTime: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileGetIn: {
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
    fontSize: 14,
    fontWeight: '400',
  },
  profileGetInTime: {
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontSize: 14,
    fontWeight: '600',
  },
  //   can get in text
  //   subtitle
  profileSubtitle: {
    display: 'flex',
    marginRight: 'auto',
    marginBottom: 10,
  },

  profileSubtitleText: {
    fontSize: 20,
    color: '#222',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },

  //   subtitle
  //   news
  profileNews: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    // marginBottom: 10,
  },
  newsItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    width: '30%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginRight: 'auto',
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#14C58B',
    marginBottom: 10,
    alignItems: 'center',
  },
  newsImgBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 40,
    height: 40,
  },
  newsImg: {
    width: 40,
    height: 40,
    objectFit: 'scale-down',
    borderRadius: 20,
  },
  newsBlockCounter: {
    position: 'absolute',
    width: 18,
    height: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#14C58B',
    top: 0,
    right: -5,
  },
  newsCounter: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    color: '#fff',
  },
  newsBlockLabel: {
    maxWidth: 74,
    minWidth: 'auto',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  newsLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    color: '#222',
  },
  //   news
  // perks
  perksItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    width: '47%',
    height: 68,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginRight: 'auto',
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#14C58B',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  perksImgBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  perksImg: {
    width: 40,
    height: 40,
    objectFit: 'scale-down',
    borderRadius: 20,
  },
  perksBlockCounter: {
    position: 'absolute',
    width: 30,
    height: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: '#14C58B',
    top: -10,
    left: -10,
  },
  perksCounter: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    color: '#fff',
  },
  perksBlockInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginRight: 'auto',
    marginLeft: 5,
  },
  perksLabel: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    color: '#222',
    lineHeight: 16,
  },
  perksName: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
    fontWeight: '400',
    color: '#777',
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 2,
  },
  perksTime: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
    fontWeight: '400',
    color: '#ff3e3e',
    lineHeight: 14,
  },
  // perks
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
  },
  //   finally btn
});

export default ProfileScreen;
