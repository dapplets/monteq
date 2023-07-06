import * as React from 'react';
import { useState } from 'react';
import { Text, StyleSheet, View, Image, Pressable, ImageSourcePropType } from 'react-native';

export type InfoUseItemType = {
  title: string;
  description: string;
  img: ImageSourcePropType;
  isLast?: boolean;
};

const InfoUseItem = ({ title, description, img, isLast }: InfoUseItemType) => {
  const [isOpen, setOpen] = useState(false);
  const openFAQ = () => {
    setOpen(!isOpen);
  };
  return (
    <View style={isLast ? styles.itemLastInfoUse : styles.itemInfoUse}>
      <Pressable onPress={openFAQ} style={styles.itemTitleInfoUse}>
        <Text style={styles.titleInfoUse}>{title}</Text>

        <Image
          resizeMode="contain"
          style={styles.arrowInfoUse}
          source={isOpen ? require('../assets/arrowGreen.png') : require('../assets/arrowGray.png')}
        />
      </Pressable>
      {isOpen ? (
        <View style={styles.descriptonBlockInfoUse}>
          <Image resizeMode="contain" style={styles.descriptonImgInfoUse} source={img} />
          <Text style={styles.descriptonInfoUse}>{description}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  itemInfoUse: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
  },
  itemLastInfoUse: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 30,
  },
  itemTitleInfoUse: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 42,
  },
  titleInfoUse: {
    width: '80%',

    fontWeight: '600',
    fontSize: 18,
    lineHeight: 21,
    color: '#222222',
  },
  arrowInfoUse: {
    width: 12,
    height: 6,
    marginRight: 4,
  },
  descriptonBlockInfoUse: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  descriptonInfoUse: {
    width: '100%',

    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#222222',
    marginBottom: 10,
  },
  descriptonImgInfoUse: {
    width: 260,
    height: 100,
    marginBottom: 20,
  },
});

export default InfoUseItem;
