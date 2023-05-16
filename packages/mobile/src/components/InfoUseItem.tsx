import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import {FontFamily} from '../GlobalStyles';
import {useState} from 'react';

export type InfoUseItemType = {
  title: string;
  description: string;
  img: ImageSourcePropType;
  isLast?: boolean;
};

const InfoUseItem = ({title, description, img, isLast}: InfoUseItemType) => {
  const [isOpen, setOpen] = useState(false);
  const openFAQ = () => {
    setOpen(!isOpen);
  };
  return (
    <View style={isLast ? styles.itemLast : styles.item}>
      <Pressable onPress={openFAQ} style={styles.itemTitle}>
        <Text style={styles.title}>{title}</Text>

        <Image
          resizeMode="contain"
          style={styles.arrow}
          source={
            isOpen
              ? require('../assets/arrowGreen.png')
              : require('../assets/arrowGray.png')
          }
        />
      </Pressable>
      {isOpen ? (
        <View style={styles.descriptonBlock}>
          <Image
            resizeMode="contain"
            style={styles.descriptonImg}
            source={img}
          />
          <Text style={styles.descripton}>{description}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
  },
  itemLast: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 30,
  },
  itemTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 42,
  },
  title: {
    width: '80%',
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_bold.ttf' : FontFamily.robotoBold,
    fontSize: 18,
    lineHeight: 21,
    color: '#222222',
  },
  arrow: {
    width: 12,
    height: 6,
    marginRight: 4,
  },
  descriptonBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  descripton: {
    width: '100%',
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_regular.ttf' : FontFamily.robotoRegular,
    fontSize: 14,
    lineHeight: 16,
    color: '#222222',
    marginBottom: 10,
  },
  descriptonImg: {
    width: 260,
    height: 100,
    marginBottom: 20,
  },
});

export default InfoUseItem;
