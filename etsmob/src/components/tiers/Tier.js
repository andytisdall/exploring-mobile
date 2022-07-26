import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
// import { Draggable } from 'react-beautiful-dnd';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from 'react-native';

import {
  createTier,
  editTier,
  fetchTitles,
  deleteTier,
  setOrder,
} from '../../actions';
import Title from '../titles/Title';
// import AddButton from '../reusable/AddButton';
// import DeleteButton from '../reusable/DeleteButton';
import requireAuth from '../reusable/requireAuth';
// import AddTitle from '../titles/AddTitle';
import baseStyle from '../../style/baseStyle';
import Arrow from '../../assets/images/right-arrow.svg';

const Tier = ({
  tier,
  titles,
  fetchTitles,
  authorized,
  band,
  tiers,
  editTier,
  deleteTier,
  setOrder,
}) => {
  const [expand, setExpand] = useState(false);
  const [titlesToRender, setTitlesToRender] = useState(null);
  const [orderedTitles, setOrderedTitles] = useState({});

  useEffect(() => {
    fetchTitles(tier.id);
  }, [fetchTitles, setOrder, tier.id]);

  useEffect(() => {
    const trackListTitles = tier.trackList.map(id => titles[id]);
    if (trackListTitles[0]) {
      setTitlesToRender(trackListTitles);

      trackListTitles.map((t, i) => {
        if (t.selectedBounce?.latest && t.selectedVersion?.current) {
          findLatest(t, t.selectedBounce);
        }
        return;
      });
    }
  }, [titles, tier.trackList]);

  // useEffect(() => {
  //   if (expand) {
  //     const sortable = new Sortable(
  //       document.querySelectorAll('.title-container'),
  //       {
  //         draggable: '.title-margin',
  //         classes: {
  //           'draggable:over': ['empty-title'],
  //           mirror: ['hidden'],
  //           'source:dragging': ['title-enlarged'],
  //         },
  //       }
  //     );
  //     sortable.on('drag:over', (e) => {
  //       console.log(e.over);
  //     });
  //   }
  // }, [expand]);

  const findLatest = (title, bounce) => {
    // console.log(title.title);
    setOrderedTitles(state => {
      return {
        ...state,
        [title.id]: new Date(bounce.date) || null,
      };
    });
  };

  const renderTitles = () => {
    const titleList = titlesToRender.filter(title => title);

    if (!tier.orderBy || tier.orderBy === 'date') {
      titleList.sort((a, b) => {
        if (orderedTitles[a.id] && orderedTitles[b.id]) {
          if (orderedTitles[a.id] > orderedTitles[b.id]) {
            return -1;
          } else {
            return 1;
          }
        } else if (orderedTitles[a.id]) {
          return -1;
        } else if (orderedTitles[b.id]) {
          return 1;
        }
        return -1;
      });
    }

    if (tier.orderBy === 'name') {
      titleList.sort((a, b) => {
        return a.title < b.title ? -1 : 1;
      });
    }

    return (
      <FlatList
        data={titleList}
        renderItem={({ item }) => {
          return <Title title={item} tier={tier} findLatest={findLatest} />;
        }}
        keyExtractor={title => title.id}
      />
    );
  };

  // const renderAddButton = () => {
  //   if (authorized) {
  //     return (
  //       <div className="order-by">
  //         <div>Add a Title to this Tier</div>
  //         <AddTitle tier={tier} onSubmit={() => setExpand(true)} />
  //       </div>
  //     );
  //   }
  // };

  // const renderEditButton = () => {
  //   if (authorized) {
  //     const tierList = band.tiers
  //       .map((id) => tiers[id])
  //       .sort((a, b) => (a.position < b.position ? -1 : 1))
  //       .map((t) => {
  //         if (t) {
  //           return { value: t.position, display: t.position };
  //         }
  //         return null;
  //       });

  //     return (
  //       <AddButton
  //         title={`Edit ${tier.name}`}
  //         image="images/edit.png"
  //         fields={[
  //           {
  //             label: 'Tier Name',
  //             name: 'name',
  //             type: 'input',
  //             required: true,
  //           },
  //           {
  //             label: 'Tier Position',
  //             name: 'position',
  //             type: 'select',
  //             options: tierList,
  //           },
  //         ]}
  //         onSubmit={(formValues) => editTier(formValues, tier.id)}
  //         initialValues={{ name: tier.name, position: tier.position }}
  //         form={`edit-tier-${tier.id}`}
  //         enableReinitialize={true}
  //       />
  //     );
  //   }
  // };

  // const renderDeleteButton = () => {
  //   if (authorized) {
  //     return (
  //       <DeleteButton
  //         onSubmit={() => deleteTier(tier.id)}
  //         displayName={tier.name}
  //       />
  //     );
  //   }
  // };

  const renderTotalTime = () => {
    if (titlesToRender) {
      const total = titlesToRender.reduce((prev, cur) => {
        return prev + cur.selectedBounce?.duration;
      }, 0);

      if (!total) {
        return null;
      }

      const minutes = Math.floor(total / 60);
      const seconds =
        Math.floor(total % 60) < 10
          ? '0' + Math.floor(total % 60)
          : Math.floor(total % 60);
      return <Text>{`${minutes}:${seconds}`}</Text>;
    }
  };

  // const renderOrderButton = () => {
  //   if (!tier.orderBy || tier.orderBy === 'date') {
  //     return (
  //       <div className="order-by">
  //         <div>Order titles by: </div>
  //         <div
  //           className="order-button order-active"
  //           onClick={(e) => e.stopPropagation()}
  //         >
  //           Date
  //         </div>
  //         <div
  //           className="order-button"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             setOrder(tier.id, 'name');
  //           }}
  //         >
  //           ABC
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (tier.orderBy === 'name') {
  //     return (
  //       <div className="order-by">
  //         <div>Order titles by:</div>
  //         <div
  //           className="order-button"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             setOrder(tier.id, 'date');
  //           }}
  //         >
  //           Date
  //         </div>
  //         <div
  //           className="order-button order-active"
  //           onClick={(e) => e.stopPropagation()}
  //         >
  //           ABC
  //         </div>
  //       </div>
  //     );
  //   }
  // };

  // const renderOptions = () => {
  //   return (
  //     <>
  //       {renderAddButton()}
  //       {renderOrderButton()}
  //     </>
  //   );
  // };

  const arrow = expand ? styles.arrowRotated : {};
  const open = expand ? 'open' : 'closed';

  const renderTier = () => {
    return (
      <>
        <Pressable
          style={[baseStyle.marqee, baseStyle.tier]}
          onPress={() => setExpand(state => !state)}
        >
          <View style={[styles.tierName]}>
            <Arrow style={arrow} />
            <Text style={baseStyle.h2}>{tier.name}</Text>
          </View>
          <View style={[styles.tierCount]}>
            <Text style={baseStyle.text}>{tier.trackList.length} songs</Text>
            <Text style={baseStyle.text}>{renderTotalTime()}</Text>
          </View>
          <View style={styles.tierDisplay}>
            {/* {renderEditButton()}
              {renderDeleteButton()} */}
          </View>
        </Pressable>
        {/* <View style={styles.tierOptions}>{expand && renderOptions()}</View> */}
        <View>{expand && titlesToRender && renderTitles()}</View>
      </>
    );
  };

  // check auth status to render draggable tiers
  return renderTier();
};

const styles = StyleSheet.create({
  tierCount: {
    width: '35%',
    flexDirection: 'row',
  },
  tierDisplay: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierOptions: {},
  tierName: {
    width: '55%',
    flexDirection: 'row',
  },
  arrowRotated: {
    transition: 'all 0.2s',
    transform: [{ rotate: '90deg' }],
  },
});

const mapStateToProps = state => {
  return {
    titles: state.titles,
    band: state.bands.currentBand,
    tiers: state.tiers,
  };
};

export default connect(mapStateToProps, {
  createTier,
  fetchTitles,
  editTier,
  deleteTier,
  setOrder,
})(requireAuth(Tier));
