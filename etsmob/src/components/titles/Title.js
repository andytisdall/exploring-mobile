import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Version from '../versions/Version';
// import AddButton from '../reusable/AddButton';
import {
  fetchVersions,
  fetchBounces,
  selectBounce,
  selectVersion,
} from '../../actions';
import PlayContainer from '../reusable/PlayContainer';

import baseStyle from '../../style/baseStyle';
// import DeleteButton from '../reusable/DeleteButton';
import Arrow from '../../assets/images/right-arrow.svg';

const Title = ({
  tier,
  title,
  titles,
  bounces,
  selectBounce,
  audio,
  findLatest,
}) => {
  const [expand, setExpand] = useState(false);
  const [bounceList, setBounceList] = useState(null);
  const [song, setSong] = useState(null);

  useEffect(() => {
    // console.log('a');
    if (title.selectedBounce && title.selectedVersion) {
      setSong({
        parent: tier,
        title: titles[title.id],
        version: title.selectedVersion,
        bounce: title.selectedBounce,
      });
      if (title.selectedVersion.current) {
        if (title.selectedBounce) {
          if (
            title.selectedVersion.bounces.includes(title.selectedBounce.id) &&
            title.selectedBounce.latest
          ) {
            findLatest(title, title.selectedBounce);
          }
        } else {
          findLatest(title, null);
        }
      }
    } else if (
      song &&
      (!title.selectedVersion || !title.selectedVersion.bounces.length)
    ) {
      setSong(null);
      findLatest(title, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title.selectedBounce, title.selectedVersion]);

  useEffect(() => {
    // console.log('c');
    if (title.selectedVersion) {
      if (title.selectedVersion.bounces[0]) {
        setBounceList(title.selectedVersion.bounces.map(id => bounces[id]));
      } else if (title.selectedBounce !== null) {
        // console.log('set bounce list null');
        setBounceList(null);
        selectBounce(null, title.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectBounce, title.selectedVersion, bounces]);

  useEffect(() => {
    // console.log('d');
    if (bounceList && bounceList[0]) {
      // set the title.selected bounce if the bounce list has been modified and no longer matches the current title.selected bounce

      let bounceToSelect;

      if (!title.selectedBounce || !bounceList.includes(title.selectedBounce)) {
        // if not found that means the selected version has changed so just select the latest bounce

        bounceToSelect = bounceList.find(b => b.latest);
      }

      if (bounceToSelect) {
        selectBounce(bounceToSelect, title.id);
        // console.log('select bounce');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectBounce, title.id]);

  const renderPlayContainer = () => {
    if (song) {
      return <PlayContainer song={song} />;
    }
  };

  const renderVersion = () => {
    return <Version title={title} song={song} tier={tier} />;
  };

  const current = audio.currentSong ? audio.currentSong.audio : null;
  const parent = audio.parent ? audio.parent.id : null;

  const regularColors = [
    'rgba(233, 255, 255, 0.479)',
    'rgba(213, 247, 255, 0.616)',
    'rgb(181, 188, 255)',
    'rgba(168, 209, 255, 0.781)',
    'rgba(210, 255, 210, 0)',
  ];
  const currentSongColors = [
    'rgba(255, 233, 233, 0.479)',
    'rgba(255, 218, 183, 0.616)',
    'rgb(244, 255, 83)',
    'rgba(255, 240, 108, 0.781)',
    'rgba(255, 243, 210, 0)',
  ];

  let colors = regularColors;

  if (current && title.selectedBounce) {
    colors =
      parent === tier.id && current === title.selectedBounce.id
        ? currentSongColors
        : regularColors;
  }

  let arrow = expand ? styles.arrowRotated : {};

  return (
    <View style={styles.titleMargin}>
      <Pressable onPress={() => setExpand(!expand)} style={styles.topBorder}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[baseStyle.marqee, styles.title]}
        >
          <View style={styles.titleName}>
            <Arrow style={arrow} />
            <Text style={baseStyle.h3}>{title.title}</Text>
          </View>
          {renderPlayContainer()}
        </LinearGradient>
      </Pressable>

      <View style={styles.versionContainer}>{expand && renderVersion()}</View>
    </View>
  );
};

export const styles = StyleSheet.create({
  titleMargin: {
    marginLeft: 10,
    paddingLeft: 8,
    marginRight: 5,
  },
  topBorder: {
    borderTopColor: 'rgb(20, 29, 11)',
    borderTopWidth: 1,
  },
  title: {
    flexDirection: 'row',
  },
  titleName: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    paddingRight: 15,
  },
  arrowRotated: {
    transform: [{ rotate: '90deg' }],
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  songPositionContainer: {
    height: 30,
    width: 30,
    marginLeft: 5,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songPosition: {
    fontSize: 18,
  },
});

const mapStateToProps = state => {
  return {
    bounces: state.bounces,
    titles: state.titles,
    audio: state.audio,
  };
};

export default connect(mapStateToProps, {
  fetchVersions,
  fetchBounces,
  selectVersion,
  selectBounce,
})(Title);
