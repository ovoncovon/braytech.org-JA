import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { fromNow } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { removeMemberIds } from '../../../utils/paths';
import * as utils from '../../../utils/destinyUtils';
import Button from '../../../components/UI/Button';
import ObservedImage from '../../ObservedImage';
import { Common } from '../../../svg';

import './styles.css';

class Characters extends React.Component {
  render() {
    const { member, viewport, location, mini, colourised } = this.props;
    const characters = member.data.profile.characters;
    const characterActivities = member.data.profile.characterActivities;
    const characterEquipment = member.data.profile.characterEquipment.data;
    // const metrics = member.data.profile.metrics.data.metrics; already returned with item in characterEquipment

    const lastActivities = utils.lastPlayerActivity({ profile: { characters, characterActivities } });

    const publicPaths = ['/maps', '/legend'];
    const goto = removeMemberIds((location && location.state?.from?.pathname) || '/now');

    return (
      <div className={cx('characters-list', { responsive: viewport.width < 1024, mini })}>
        {characters.data.map(character => {
          const lastActivity = lastActivities.find(a => a.characterId === character.characterId);

          const state = (
            <>
              <div className='activity'>{lastActivity.lastActivityString}</div>
              <time>{fromNow(lastActivity.lastPlayed)}</time>
            </>
          );

          const to = !publicPaths.includes(goto) ? `/${member.membershipType}/${member.membershipId}/${character.characterId}${goto}` : goto;

          const emblem = characterEquipment[character.characterId].items.find(i => i.bucketHash === 4274335291);
          const metricImages = emblem?.metricHash && utils.metricImages(emblem.metricHash);

          console.log(emblem);

          const emblemPath = mini ? character.emblemPath : character.emblemBackgroundPath;

          return (
            <div key={character.characterId} className='char'>
              <Button className='linked' anchor to={to} action={this.props.onClickCharacter(character.characterId)}>
                <ObservedImage
                  className={cx('image', 'emblem', {
                    missing: !emblemPath
                  })}
                  src={`https://www.bungie.net${emblemPath || '/img/misc/missing_icon_d2.png'}`}
                />
                {!mini && metricImages ? (
                  <div className='metric'>
                    <div className='progress'>{utils.displayValue(emblem.metricObjective.progress, 0, emblem.metricObjective.objectiveHash)}</div>
                    <div className={cx('gonfalon', { complete: emblem.metricObjective.complete })}>
                      <ObservedImage className='image banner' src={`https://www.bungie.net${metricImages.banner}`} />
                      <ObservedImage className='image trait' src={`https://www.bungie.net${metricImages.trait}`} />
                      <ObservedImage className='image metric' src={`https://www.bungie.net${metricImages.metric}`} />
                      <ObservedImage className='image banner complete' src='/static/images/extracts/ui/metrics/01E3-10F0.png' />
                    </div>
                  </div>
                ) : null}
                <div className='class'>{utils.classHashToString(character.classHash, character.genderHash)}</div>
                <div className='species'>{utils.raceHashToString(character.raceHash, character.genderHash)}</div>
                <div className='light'>{character.light}</div>
              </Button>
              {character.titleRecordHash ? (
                <div className={cx('title', { colourised })}>
                  <div className='icon'>
                    <Common.SealTitle />
                  </div>
                  <div className='text'>{manifest.DestinyRecordDefinition[character.titleRecordHash].titleInfo.titlesByGenderHash[character.genderHash]}</div>
                </div>
              ) : null}
              <div className='state'>{state}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport
  };
}

export default connect(mapStateToProps)(Characters);
