import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { StyleSheet, Pressable } from 'react-native';

// import AddButton from '../reusable/AddButton';
// import DeleteButton from '../reusable/DeleteButton';
import DetailBox from '../reusable/DetailBox';
import { selectBounce, queueSongs, fetchBounces } from '../../actions';
import PlayButton from '../../assets/images/play.svg';

// const track = {
//   url: 'https://exploring-the-space.com/api/audio/6296e3341c63594359293ce4.mp3',
//   title: 'Q-Anon',
//   artist: 'The Paranoid Orchestra',
// };

const Bounce = ({
  bounces,
  selectBounce,
  title,
  version,
  song,
  queueSongs,
  fetchBounces,
}) => {
  const [selectedBounce, setSelectedBounce] = useState(title.selectedBounce);
  const [bounceList, setBounceList] = useState(null);

  useEffect(() => {
    fetchBounces(version.id);
  }, [version, fetchBounces]);

  useEffect(() => {
    if (
      selectedBounce &&
      title.selectedBounce &&
      selectedBounce.id !== title.selectedBounce.id
    ) {
      selectBounce(selectedBounce, title.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBounce, selectBounce, title.id]);

  useEffect(() => {
    if (selectedBounce !== title.selectedBounce) {
      setSelectedBounce(title.selectedBounce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, title.selectedBounce]);

  useEffect(() => {
    setBounceList(version.bounces.map(id => bounces[id]));
    // console.log('x');
  }, [bounces, version.bounces]);

  useEffect(() => {
    if (
      bounceList &&
      bounceList[0] &&
      (!selectedBounce || !version.bounces.includes(selectedBounce.id))
    ) {
      let bounceToSelect = bounceList.find(b => b.latest);
      if (!bounceToSelect) {
        bounceToSelect = bounceList[0];
      }
      setSelectedBounce(bounceToSelect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounceList, selectedBounce]);

  const displayDate = date => {
    return moment.utc(date).format('MM/DD/yy');
  };

  const displayBounce = b => {
    return `${displayDate(b.date)}`;
  };

  const itemList = () => {
    if (selectedBounce) {
      return bounceList
        .filter(b => b && b.id !== selectedBounce.id)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
    }
  };

  const showPlayButton = () => {
    return (
      <Pressable onPress={() => queueSongs(song)}>
        <PlayButton style={styles.playButton} />
      </Pressable>
    );
  };

  if (bounceList) {
    return (
      <>
        <DetailBox
          selectedItem={selectedBounce}
          itemType="Bounce"
          itemList={itemList}
          displayItem={displayBounce}
          setSelected={setSelectedBounce}
          playButton={showPlayButton}
        />
      </>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  playButton: {
    height: 30,
    width: 30,
  },
});

const mapStateToProps = state => {
  return {
    bounces: state.bounces,
  };
};

export default connect(mapStateToProps, {
  selectBounce,
  queueSongs,
  fetchBounces,
})(Bounce);
