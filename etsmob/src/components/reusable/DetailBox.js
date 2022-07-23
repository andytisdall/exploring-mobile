import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { Text, View, StyleSheet, Pressable } from 'react-native';

import baseStyle from '../../style/baseStyle';

const DetailBox = ({
  selectedItem,
  itemList,
  itemType,
  displayItem,
  setSelected,
  renderAddButton,
  renderEditButton,
  renderDeleteButton,
  playButton,
  onAddSubmit,
  authorized,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [droppingFile, setDroppingFile] = useState(false);

  const dropdownRef = useRef(null);

  // useEffect(() => {
  //   const onBodyClick = (e) => {
  //     if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
  //       return;
  //     }

  //     if (dropdownVisible) {
  //       setDropdownVisible(false);
  //     }
  //   };

  //   if (dropdownVisible) {
  //     document.addEventListener('click', onBodyClick, { capture: true });
  //   } else {
  //     document.removeEventListener('click', onBodyClick, { capture: true });
  //   }
  //   return () =>
  //     document.removeEventListener('click', onBodyClick, { capture: true });
  // }, [dropdownVisible]);

  const count = () => {
    let count;
    if (itemList().length === 0) {
      count = `1 ${itemType}:`;
    } else {
      count = `${itemList().length + 1} ${itemType}s:`;
    }

    return <Text style={baseStyle.h5}>{count}</Text>;
  };

  const currentTag = () => {
    if (selectedItem.current || selectedItem.latest) {
      return <Text style={styles.current}>Current</Text>;
    }
  };

  const renderItemList = () => {
    if (dropdownVisible) {
      return itemList().map((i) => {
        const current =
          i.current || i.latest ? (
            <Text style={styles.listCurrent}> * current</Text>
          ) : null;
        return (
          <Pressable
            onPress={() => {
              setSelected(i);
              setDropdownVisible(false);
            }}
            key={i.id}
            style={styles.dropdownLink}
          >
            <Text>{displayItem(i)}</Text>
            {current}
          </Pressable>
        );
      });
    }
  };

  const renderNotes = () => {
    if (selectedItem.notes || selectedItem.comments) {
      return (
        <View style={styles.detailNotes}>
          <Text style={styles.detailNotesTitle}>Notes:</Text>
          <Text style={[baseStyle.text, styles.detailNotesContent]}>
            {selectedItem.notes || selectedItem.comments}
          </Text>
        </View>
      );
    }
  };

  const renderDetail = () => {
    if (selectedItem) {
      return (
        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>{count()}</View>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdown} ref={dropdownRef}>
              <Pressable onPress={() => setDropdownVisible(!dropdownVisible)}>
                <Text style={styles.dropbtn}>{displayItem(selectedItem)}</Text>
              </Pressable>
              <View style={[styles.dropdownContent]}>{renderItemList()}</View>
            </View>
            {playButton && playButton()}
          </View>

          {currentTag()}
          {renderNotes()}
        </View>
      );
    } else {
      let parentType = '';
      if (itemType === 'Version') {
        parentType = 'Song';
      }
      if (itemType === 'Bounce') {
        parentType = 'Version';
      }
      return (
        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <Text
              style={baseStyle.h5}
            >{`No ${itemType}s for this ${parentType} Yet`}</Text>
          </View>
        </View>
      );
    }
  };

  // const onDragOver = (e) => {
  //   if (!droppingFile) {
  //     setDroppingFile(true);
  //   }
  // };

  // const onMouseOver = (e) => {
  //   if (droppingFile) {
  //     setDroppingFile(false);
  //   }
  // };

  // const onDrop = (e) => {
  //   // this is the only way the file would be defined!
  //   setTimeout(() => {
  //     const { files } = e.target;
  //     // const words = files[0].name.split(' ');
  //     // let date = new Date(words[words.length - 1].split('.')[0]);

  //     // if (!date instanceof Date || isNaN(date)) {
  //     //   date = new Date();
  //     // }
  //     const fileName = files[0].name.split('.')[0];
  //     let date = new moment(fileName);
  //     if (!date.isValid()) {
  //       date = new Date();
  //     }
  //     const formValues = {
  //       date,
  //       comments: '',
  //       latest: true,
  //       file: files,
  //     };
  //     onAddSubmit(formValues);
  //   }, 0);
  // };

  const renderContent = () => {
    return (
      <>
        {renderDetail()}
        <View style={styles.detailButtons}>
          {/* {renderAddButton()}
          {selectedItem && renderEditButton()}
          {selectedItem && renderDeleteButton()} */}
        </View>
      </>
    );
  };

  return <View style={styles.detailBox}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  detailBox: {
    marginVertical: 4,
    width: '40%',
    borderColor: 'white',
    borderWidth: 1,
    padding: 7,
    justifyContent: 'space-between',
    backgroundColor: 'rgb(40, 40, 143)',
  },
  detailContainer: {
    alignItems: 'flex-start',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
  },
  dropdown: {
    marginRight: 8,
    flex: 1,
    alignItems: 'flex-start',
  },
  dropbtn: {
    fontSize: 17,
    backgroundColor: '#76cdff',
    padding: 5,
  },
  dropdownContent: {
    // position: 'absolute',
    backgroundColor: '#f9f9f9',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    // transform: [{ translateY: 29 }],
  },
  dropdownLink: {
    padding: 4,
    flexDirection: 'row',
    borderWidth: 1,
  },
  current: {
    marginTop: 8,
    fontSize: 9,
    color: 'rgb(228, 125, 125)',
    padding: 3,
    borderColor: 'rgb(228, 125, 125)',
    borderRadius: 8,
    borderWidth: 1,
    zIndex: -1,
  },
  listCurrent: {
    color: '#2925ff',
    fontSize: 8,
  },
  detailNotes: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailNotesTitle: {
    fontSize: 10,
    color: 'rgb(202, 202, 202)',
    marginRight: 6,
  },
  detailNotesContent: {
    fontSize: 9,
  },
  detailButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default DetailBox;
