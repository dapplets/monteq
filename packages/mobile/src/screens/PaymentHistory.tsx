// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
// import {type RootStackParamList} from '../App';
import {Border, Color, FontFamily, FontSize, Padding} from '../GlobalStyles';
// import BarcodeScannerModule from '../modules/BarcodeScannerModule';
const UserPaymentHistory = () => {
  //   const {provider} = useWeb3Modal();
  //   const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  //   function handleDisconnectPress() {
  //     provider?.disconnect();
  //   }

  //   async function handleScanPress() {
  //     navigation.navigate('CameraScreen');
  //   }

  // async function handleGmsScanPress() {
  //   try {
  //     const data = await BarcodeScannerModule.scan();
  //     Alert.alert('Success', data);
  //   } catch (e) {
  //     // ToDo: catch CANCELED and FAILURE cases
  //     console.error(e);
  //     Alert.alert('Failure or canceled');
  //   }
  // }

  return (
    <View style={styles.userpaymenthistory}>
      <View style={styles.content}>
        <View style={styles.frameParent}>
          <View style={[styles.frameGroup, styles.frameWrapperFlexBox]}>
            <View style={[styles.ellipseParent, styles.usdtParentFlexBox]}>
              <Image
                style={styles.frameChild}
                resizeMode="cover"
                source={require('../assets/ellipse-4.png')}
              />
              <Text style={styles.day}>Day</Text>
            </View>
            <View style={styles.weekWrapper}>
              <Text style={styles.week}>Week</Text>
            </View>
            <View style={styles.weekWrapper}>
              <Text style={styles.week}>Month</Text>
            </View>
            <View style={styles.weekWrapper}>
              <Text style={styles.week}>Year</Text>
            </View>
          </View>
          <View style={[styles.frameWrapper, styles.frameLayout]}>
            <View style={styles.spentTodayParent}>
              <Text style={[styles.spentToday, styles.includingClr]}>
                Spent today
              </Text>
              <Text style={[styles.usdt, styles.usdtSpaceBlock]}>
                <Text style={styles.text}>{`24 778,24 `}</Text>
                <Text style={styles.usdt1}>USDT</Text>
              </Text>
              <Text
                style={[
                  styles.including120225Container,
                  styles.usdtSpaceBlock,
                ]}>
                <Text style={styles.includingClr}>{`including `}</Text>
                <Text style={[styles.text1, styles.usdtTypo]}>1 202,25</Text>
                <Text style={styles.includingClr}> USDT tips</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.frameContainer, styles.wrapperBorder]}>
            <View style={styles.frameBorder}>
              <View style={styles.frameWrapperFlexBox}>
                <Image
                  style={[styles.clockIcon, styles.iconLayout]}
                  resizeMode="cover"
                  source={require('../assets/clock.png')}
                />
              </View>
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +2,11 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text style={[styles.bv803pp980, styles.text2Typo]}>
                  bv803pp980
                </Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <View style={styles.frameWrapperFlexBox}>
                <Image
                  style={[styles.clockIcon, styles.iconLayout]}
                  resizeMode="cover"
                  source={require('../assets/clock.png')}
                />
              </View>
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +4,08 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text style={[styles.bv803pp980, styles.text2Typo]}>
                  bv803pp980
                </Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +4,22 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bv803pp980,
                    styles.text2Typo,
                  ]}>{`PETERS PIE & COFFEE`}</Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +4,22 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text style={[styles.bv803pp980, styles.text2Typo]}>
                  bv803pp980
                </Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +11,60 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text style={[styles.bv803pp980, styles.text2Typo]}>
                  bv803pp980
                </Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +11,60 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bv803pp980,
                    styles.text2Typo,
                  ]}>{`PETERS PIE & COFFEE`}</Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +8,05 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text style={[styles.bv803pp980, styles.text2Typo]}>
                  bv803pp980
                </Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +8,05 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bv803pp980,
                    styles.text2Typo,
                  ]}>{`PETERS PIE & COFFEE`}</Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +4,22 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bv803pp980,
                    styles.text2Typo,
                  ]}>{`PETERS PIE & COFFEE`}</Text>
              </View>
            </View>
            <View style={[styles.frameParent2, styles.frameBorder]}>
              <Image
                style={[styles.clockIcon, styles.iconLayout]}
                resizeMode="cover"
                source={require('../assets/checkcircle.png')}
              />
              <View style={styles.frameParent1}>
                <View style={[styles.usdtParent, styles.usdtParentFlexBox]}>
                  <Text style={[styles.usdt2, styles.usdtTypo]}>
                    +4,22 USDT
                  </Text>
                  <Text style={[styles.text2, styles.text2Typo]}>
                    26/04/2023 11:13
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bv803pp980,
                    styles.text2Typo,
                  ]}>{`PETERS PIE & COFFEE`}</Text>
              </View>
            </View>
            <View
              style={[
                styles.morePaymentsFor12212UsdtWrapper,
                styles.usdtParentFlexBox,
              ]}>
              <Text style={[styles.morePaymentsFor, styles.includingClr]}>
                12 more payments for 122,12 USDT today
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.headline, styles.headlineLayout]}>
        <View
          style={[
            styles.icroundQrCodeScannerParent,
            styles.frameWrapperFlexBox,
          ]}>
          <Image
            style={[styles.icroundQrCodeScannerIcon, styles.iconLayout]}
            resizeMode="cover"
            source={require('../assets/icroundqrcodescanner.png')}
          />
          <Text style={styles.paymentHistory}>Payment history</Text>
        </View>
      </View>
    
    </View>
  );
};
const styles = StyleSheet.create({
  frameWrapperFlexBox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  usdtParentFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  frameLayout: {
    width: 300,
    marginTop: 10,
    borderRadius: Border.br_9xs,
  },
  includingClr: {
    color: Color.gray_200,
    // fontFamily: FontFamily.content,
  },
  usdtSpaceBlock: {
    marginTop: 7,
    textAlign: 'left',
  },
  usdtTypo: {
    fontWeight: '700',
    color: Color.gray_300,
  },
  wrapperBorder: {
    borderColor: '#ebebeb',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: Padding.p_3xs,
  },
  iconLayout: {
    height: 24,
    width: 24,
    overflow: 'hidden',
  },
  text2Typo: {
    fontFamily: FontFamily.robotoRegular,
    fontSize: FontSize.size_3xs,
    color: Color.gray_100,
    textAlign: 'left',
  },
  frameBorder: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_7xs,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderRadius: Border.br_9xs,
  },
  headlineLayout: {
    height: 60,
    width: 320,
  },
  frameParentPosition: {
    bottom: '0%',
    top: '0%',
    width: '31.25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
  },
  frameChild: {
    width: 8,
    height: 8,
  },
  day: {
    color: Color.mediumseagreen,
    marginLeft: 6,
    textAlign: 'left',
    // fontFamily: FontFamily.content,
    fontWeight: '600',
    // fontSize: FontSize.content_size,
  },
  ellipseParent: {
    padding: Padding.p_3xs,
    height: 38,
    justifyContent: 'center',
    backgroundColor: Color.white,
    borderRadius: Border.br_7xs,
    flex: 1,
  },
  week: {
    color: Color.gray_100,
    textAlign: 'left',
    // fontFamily: FontFamily.content,
    // fontSize: FontSize.content_size,
  },
  weekWrapper: {
    borderColor: '#919191',
    marginLeft: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'center',
    padding: Padding.p_3xs,
    height: 38,
    borderRadius: Border.br_7xs,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  frameGroup: {
    alignSelf: 'stretch',
    borderRadius: Border.br_9xs,
  },
  spentToday: {
    fontSize: FontSize.regular_size,
    textAlign: 'left',
  },
  text: {
    fontSize: FontSize.size_9xl,
  },
  usdt1: {
    // fontSize: FontSize.content_size,
  },
  usdt: {
    color: Color.gray_300,
    fontWeight: '700',
    // fontFamily: FontFamily.content,
  },
  text1: {
    color: Color.gray_300,
    // fontFamily: FontFamily.content,
  },
  including120225Container: {
    // fontSize: FontSize.regular_size,
  },
  spentTodayParent: {
    flex: 1,
  },
  frameWrapper: {
    backgroundColor: Color.gray_600,
    marginTop: 10,
    padding: Padding.p_3xs,
    alignItems: 'center',
    flexDirection: 'row',
  },
  clockIcon: {
    overflow: 'hidden',
  },
  usdt2: {
    fontFamily: FontFamily.robotoBold,
    color: Color.gray_300,
    textAlign: 'left',
    // fontSize: FontSize.content_size,
    flex: 1,
  },
  text2: {
    marginLeft: 10,
  },
  usdtParent: {
    alignSelf: 'stretch',
  },
  bv803pp980: {
    marginTop: 3,
    alignSelf: 'stretch',
  },
  frameParent1: {
    marginLeft: 10,
    flex: 1,
  },
  frameParent2: {
    marginTop: 10,
  },
  morePaymentsFor: {
    fontSize: FontSize.size_xs,
    textAlign: 'left',
  },
  morePaymentsFor12212UsdtWrapper: {
    paddingVertical: 0,
    marginTop: 10,
    alignSelf: 'stretch',
    paddingHorizontal: Padding.p_3xs,
    borderRadius: Border.br_9xs,
  },
  frameContainer: {
    marginTop: 10,
    width: 300,
    borderRadius: Border.br_9xs,
    backgroundColor: Color.whitesmoke,
  },
  frameParent: {
    paddingTop: Padding.p_3xs,
    paddingHorizontal: Padding.p_3xs,
  },
  content: {
    top: 60,
    left: 0,
    height: 851,
    position: 'absolute',
  },
  icroundQrCodeScannerIcon: {
    display: 'none',
    overflow: 'hidden',
  },
  paymentHistory: {
    // fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.robotoSemibold,
    textAlign: 'center',
    color: Color.gray_300,
    marginLeft: 10,
    fontWeight: '600',
  },
  icroundQrCodeScannerParent: {
    padding: Padding.p_3xs,
    flex: 1,
  },
  headline: {
    top: 0,
    // backgroundColor: Color.gray_800,
    justifyContent: 'flex-end',
    left: '50%',
    marginLeft: -160,
    height: 60,
    width: 320,
    padding: Padding.p_3xs,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
  },
  icroundQrCodeScannerIcon1: {
    width: 30,
    height: 30,
    overflow: 'hidden',
  },
  circularbutton: {
    width: '18.75%',
    top: '-33.33%',
    right: '40.63%',
    bottom: '33.33%',
    left: '40.63%',
    // borderRadius: Border.br_81xl,
    backgroundColor: 'transparent',
    shadowRadius: 13,
    elevation: 13,
    height: '100%',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: -31,
    },
    shadowColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
  },
  userWrapper: {
    backgroundColor: Color.white,
    borderColor: '#ebebeb',
    borderRadius: Border.br_7xs,
    flexDirection: 'row',
  },
  logOutWrapper: {
    marginLeft: 10,
    borderRadius: Border.br_7xs,
    borderColor: '#ebebeb',
    flexDirection: 'row',
    backgroundColor: Color.whitesmoke,
  },
  frameParent12: {
    right: '6.25%',
    left: '62.5%',
  },
  shoppingCartWrapper: {
    borderRadius: Border.br_7xs,
    borderColor: '#ebebeb',
    flexDirection: 'row',
    backgroundColor: Color.whitesmoke,
  },
  frameParent13: {
    right: '62.5%',
    left: '6.25%',
  },
  bottommenu: {
    bottom: 0,
    shadowRadius: 9,
    elevation: 9,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: -31,
    },
    shadowColor: 'rgba(0, 0, 0, 0)',
    height: 60,
    width: 320,
    left: '50%',
    marginLeft: -160,
    position: 'absolute',
  },
  userpaymenthistory: {
    width: '100%',
    height: 568,
    flex: 1,
    backgroundColor: Color.whitesmoke,
    borderRadius: Border.br_9xs,
  },
});

export default UserPaymentHistory;
