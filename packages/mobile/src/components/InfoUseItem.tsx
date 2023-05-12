import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import {FontFamily} from '../GlobalStyles';
import {useState} from 'react';

export type InfoUseItemType = {
  title: string;
  description: string;
  img: ImageSourcePropType;
};

const InfoUseItem = ({title, description, img}: InfoUseItemType) => {
  const [isOpen, setOpen] = useState(false);
  const openFAQ = () => {
    setOpen(!isOpen);
  };
  return (
    <View style={styles.item}>
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
          <Text style={styles.descripton}>{description}</Text>
          <Image
            resizeMode="contain"
            style={styles.descriptonImg}
            source={img}
          />
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
    // height: 'auto',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
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
    fontFamily: FontFamily.robotoBold,
    fontSize: 18,
    lineHeight: 21,
    color: '#222222',
  },
  arrow: {
    width: 12,
    height: 6,
  },
  descriptonBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  descripton: {
    marginBottom: 20,
    width: '100%',
    fontFamily: FontFamily.robotoRegular,
    fontSize: 14,
    lineHeight: 16,
    color: '#222222',
  },
  descriptonImg: {
    width: 260,
    height: 260,
  },
});

export default InfoUseItem;
