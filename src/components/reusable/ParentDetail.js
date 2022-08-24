import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import baseStyle from '../../style/baseStyle';
import Arrow from '../../assets/images/right-arrow.svg';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ParentDetail = ({ item, childList, showChildren, options }) => {
  const [expand, setExpand] = useState(false);
  const parentType = item.trackList ? 'tier' : 'playlist';
  const childType = parentType === 'tier' ? 'trackList' : 'songs';

  const renderTotalTime = () => {
    const bounceType = parentType === 'tier' ? 'selectedBounce' : 'bounce';
    if (childList) {
      const total = childList.reduce((prev, cur) => {
        return prev + cur[bounceType]?.duration;
      }, 0);

      if (!total) {
        return null;
      }

      const minutes = Math.floor(total / 60);
      const seconds =
        Math.floor(total % 60) < 10
          ? '0' + Math.floor(total % 60)
          : Math.floor(total % 60);
      return `${minutes}:${seconds}`;
    }
  };

  const renderOptions = () => {
    if (options && expand) {
      return <View className={styles.options}>{options()}</View>;
    }
  };

  const arrow = expand ? styles.arrowRotated : {};

  return (
    <>
      <Pressable
        style={[baseStyle.marqee, baseStyle.tier]}
        onPress={() => {
          LayoutAnimation.configureNext(
            LayoutAnimation.create(
              200,
              LayoutAnimation.Types.linear,
              LayoutAnimation.Properties.scaleXY
            )
          );
          setExpand((state) => !state);
        }}
      >
        <View style={[styles.tierName]}>
          <Arrow style={arrow} />
          <Text style={[baseStyle.h2, styles.tierTitle]}>{item.name}</Text>
        </View>
        <View style={[styles.tierCount]}>
          <Text style={[baseStyle.text, styles.countItem]}>
            {item[childType].length} songs
          </Text>
          <Text style={[baseStyle.text, styles.countItem]}>
            {renderTotalTime()}
          </Text>
        </View>
      </Pressable>
      {renderOptions()}
      <View>{expand && childList && showChildren()}</View>
    </>
  );
};

const styles = StyleSheet.create({
  tierCount: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  countItem: {
    width: '50%',
  },
  tierDisplay: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierName: {
    width: '55%',
    flexDirection: 'row',
    marginRight: 30,
    alignItems: 'center',
  },
  tierTitle: {
    marginLeft: 5,
  },
  arrowRotated: {
    transition: 'all 0.2s',
    transform: [{ rotate: '90deg' }],
  },
  options: {
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'space-around',
    borderTopColor: 'rgba(179, 231, 255, 0.781)',
    paddingVertical: 5,
  },
});

export default ParentDetail;
