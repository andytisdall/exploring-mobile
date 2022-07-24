import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';

import Version from '../versions/Version';
// import AddButton from '../reusable/AddButton';
import {
  fetchVersions,
  fetchBounces,
  selectBounce,
  selectVersion,
  createPlaylistSong,
  editTitle,
  deleteTitle,
} from '../../actions';
import PlayContainer from './PlayContainer';
import requireAuth from '../reusable/requireAuth';
import baseStyle from '../../style/baseStyle';
// import DeleteButton from '../reusable/DeleteButton';
import Arrow from '../../assets/images/right-arrow.svg';

const Title = ({
  tier,
  title,
  titles,
  fetchVersions,
  versions,
  bounces,
  fetchBounces,
  authorized,
  band,
  playlists,
  selectVersion,
  selectBounce,
  createPlaylistSong,
  editTitle,
  deleteTitle,
  getTime,
  audio,
  findLatest,
  tiers,
}) => {
  const [expand, setExpand] = useState(false);
  const [bounceList, setBounceList] = useState(null);
  const [song, setSong] = useState(null);
  const [showChords, setShowChords] = useState(false);

  const chordButtonRef = useRef();
  // console.log('GG');

  useEffect(
    () => {
      // console.log('a');
      if (title.selectedBounce && title.selectedVersion) {
        setSong({
          parent: tier,
          title: titles[title.id],
          version: title.selectedVersion,
          bounce: title.selectedBounce,
        });
        getTime({ id: title.id, duration: title.selectedBounce.duration });
      } else if (song && !title.selectedBounce) {
        setSong(null);
        getTime({ id: title.id, duration: 0 });
      }
    },

    [
      // getTime,
      // tier,
      // titles,
      // title,
      // versions,
    ],
  );

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
  }, [bounces, selectBounce, title.selectedVersion]);

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
  }, [
    // bounceList,
    // findLatest,
    selectBounce,
    title.id,
    // title.selectedBounce
  ]);

  const renderPlayContainer = () => {
    if (song) {
      return <PlayContainer song={song} />;
    }
  };

  // const renderChordsButton = () => {
  //   if (title.chords) {
  //     return (
  //       <div className="chords-container" ref={chordButtonRef}>
  //         <img
  //           src="/images/clef.png"
  //           alt="song chords"
  //           className="chords-button"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             setShowChords((state) => !state);
  //           }}
  //         />
  //         {showChords && <div className="chords-box">{title.chords}</div>}
  //       </div>
  //     );
  //   }
  // };

  const renderVersion = () => {
    return <Version title={title} song={song} tier={tier} />;
  };

  // const onAddToPlaylist = (formValues) => {
  //   createPlaylistSong({
  //     ...formValues,
  //     bounce: title.selectedBounce.id,
  //     version: title.selectedVersion.id,
  //     title: title.id,
  //   });
  // };

  // const renderButtons = () => {
  //   if (authorized) {
  //     const bandPlaylists = band.playlists.map((id) => playlists[id]);
  //     const playlistOptions = bandPlaylists
  //       .sort((a, b) => (a.position > b.position ? 1 : -1))
  //       .map((pl) => {
  //         if (pl) {
  //           return { value: pl.id, display: pl.name };
  //         }
  //         return null;
  //       });
  //     const bandTiers = band.tiers
  //       .filter((t) => t !== tier.id)
  //       .map((id) => tiers[id]);
  //     const tierOptions = bandTiers.map((t) => {
  //       if (t) {
  //         return { value: t.id, display: t.name };
  //       }
  //       return null;
  //     });
  //     tierOptions.unshift({ value: null, display: '' });
  //     return (
  //       <div className="tier-display">
  //         {song && (
  //           <AddButton
  //             title="Add to a Playlist"
  //             onSubmit={(formValues) => onAddToPlaylist(formValues)}
  //             image="images/playlist.png"
  //             fields={[
  //               {
  //                 type: 'select',
  //                 options: playlistOptions,
  //                 name: 'playlistId',
  //                 label: 'Playlist',
  //               },
  //             ]}
  //             form={`add-to-playlist-${title.id}`}
  //             enableReinitialize={true}
  //           />
  //         )}
  //         <AddButton
  //           title={`Edit ${title.title}`}
  //           image="images/edit.png"
  //           fields={[
  //             {
  //               label: 'Title',
  //               name: 'title',
  //               type: 'input',
  //               required: true,
  //             },
  //             {
  //               label: 'Move to Tier',
  //               name: 'move',
  //               type: 'select',
  //               options: tierOptions,
  //             },
  //             {
  //               label: 'Chords',
  //               name: 'chords',
  //               type: 'textarea',
  //             },
  //           ]}
  //           onSubmit={(formValues) => editTitle(formValues, title.id, tier.id)}
  //           initialValues={{
  //             title: title.title,
  //             move: null,
  //             chords: title.chords,
  //           }}
  //           form={`edit-title-${title.id}`}
  //           enableReinitialize={true}
  //         />
  //         <DeleteButton
  //           onSubmit={() => deleteTitle(title.id, tier.id)}
  //           displayName={title.title}
  //         />
  //       </div>
  //     );
  //   }
  // };

  const current = audio.currentSong ? audio.currentSong.audio : null;
  const parent = audio.parent ? audio.parent.id : null;

  // console.log(current, parent);

  let currentClass = {};

  if (current && title.selectedBounce) {
    currentClass =
      parent === tier.id && current === title.selectedBounce.id
        ? styles.current
        : {};
  }

  let arrow = expand ? styles.arrowRotated : {};

  return (
    <View style={styles.titleMargin}>
      <Pressable
        style={[baseStyle.marqee, styles.title, currentClass]}
        onPress={() => setExpand(!expand)}
      >
        <View style={styles.titleName}>
          <Arrow style={arrow} />
          <Text style={baseStyle.h3}>{title.title}</Text>
        </View>
        {/* {renderChordsButton()} */}
        {renderPlayContainer()}
        {/* {renderButtons()} */}
      </Pressable>

      <View style={styles.versionContainer}>{expand && renderVersion()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleMargin: {
    marginLeft: 10,
    paddingLeft: 8,
  },
  title: {
    borderTopColor: 'rgb(20, 29, 11)',
    borderTopWidth: 1,
    backgroundColor: 'rgb(181, 188, 255)',
    flexDirection: 'row',
  },
  titleName: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  arrowRotated: {
    transform: [{ rotate: '90deg' }],
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  current: {
    backgroundColor: 'rgb(255, 240, 108)',
  },
});

const mapStateToProps = state => {
  return {
    versions: state.versions,
    bounces: state.bounces,
    band: state.bands.currentBand,
    playlists: state.playlists,
    titles: state.titles,
    audio: state.audio,
    tiers: state.tiers,
  };
};

export default connect(mapStateToProps, {
  fetchVersions,
  fetchBounces,
  selectVersion,
  selectBounce,
  createPlaylistSong,
  editTitle,
  deleteTitle,
})(requireAuth(Title));
