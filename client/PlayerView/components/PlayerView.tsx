import * as React from "react";

import * as _ from "lodash";

import { CombatStats } from "../../../common/CombatStats";
import { TagState } from "../../../common/CombatantState";
import { PlayerViewCombatantState } from "../../../common/PlayerViewCombatantState";
import { PlayerViewState } from "../../../common/PlayerViewState";
import { CombatFooter } from "./CombatFooter";
import { CombatStatsPopup } from "./CombatStatsPopup";
import { CustomStyles } from "./CustomStyles";
import { ApplyDamageCallback, DamageSuggestor } from "./DamageSuggestor";
import { PlayerViewCombatant } from "./PlayerViewCombatant";
import { PlayerViewCombatantHeader } from "./PlayerViewCombatantHeader";
import { PortraitWithCaption } from "./PortraitModal";
import { ApplyTagCallback, TagSuggestor } from "./TagSuggestor";
import {Listing} from "../../Library/Listing";
import {Listable} from "../../../common/Listable";
import {PlayerViewTags} from "./PlayerViewTags";


interface LocalState {
  showPortrait: boolean;
  showCombatStats: boolean;
  portraitWasRequestedByClick: boolean;
  portraitURL: string;
  portraitCaption: string;

  suggestDamageCombatant: PlayerViewCombatantState;
  suggestTagCombatant: PlayerViewCombatantState;
}

interface OwnProps {
  onSuggestDamage: ApplyDamageCallback;
  onSuggestTag: (combatantId: string, tagState: TagState) => void;
  combatStats?: CombatStats;
  conditions?: Array<any>;
  conditionsCurrent?: Array<any>;

}

export type PlayerViewProps = PlayerViewState & OwnProps;
export class PlayerView extends React.Component<PlayerViewProps, LocalState> {
  private modalTimeout: number;

  constructor(props) {
    super(props);
    this.state = {
      showPortrait: false,
      showCombatStats: false,
      portraitWasRequestedByClick: false,
      portraitURL: "",
      portraitCaption: "",
      suggestDamageCombatant: null,
      suggestTagCombatant: null,
    };
  }

  public render() {
    const footerVisible =
      this.props.settings.DisplayRoundCounter ||
      this.props.settings.DisplayTurnTimer;

    const acColumnVisible = this.props.encounterState.Combatants.some(
      c => c.AC != undefined
    );
    var conditionsCurrent = []
    // this.props.encounterState.Combatants.map(combatant => (
    let tags = []
    if ( this.props.encounterState.Combatants.length > 0) {
         this.props.encounterState.Combatants.map(combatant => {
          if (combatant.Tags.length > 0) {
            tags.push(...combatant.Tags.map(v=>v.Text))
          }
        })
      conditionsCurrent =  this.props.conditions.filter(v=> tags.indexOf(v['name'])>-1)
      }
    const modalVisible =
      this.state.showPortrait ||
      this.state.suggestDamageCombatant ||
      this.state.suggestTagCombatant ||
      this.state.showCombatStats;

    const combatantsById = _.keyBy(
      this.props.encounterState.Combatants,
      c => c.Id
    );
    const combatantNamesById = _.mapValues(combatantsById, c => c.Name);
    console.log(this.props)

    return (
      <div className="c-player-view">
        <CustomStyles
          CustomCSS={this.props.settings.CustomCSS}
          CustomStyles={this.props.settings.CustomStyles}
          TemporaryBackgroundImageUrl={
            this.props.encounterState.BackgroundImageUrl
          }
        />
        {modalVisible && (
          <div className="modal-blur" onClick={this.closeAllModals} />
        )}
        {this.state.showPortrait && (
          <PortraitWithCaption
            imageURL={this.state.portraitURL}
            caption={this.state.portraitCaption}
            onClose={this.closeAllModals}
          />
        )}
        {this.state.suggestDamageCombatant && (
          <DamageSuggestor
            combatant={this.state.suggestDamageCombatant}
            onApply={this.handleSuggestDamagePrompt}
          />
        )}
        {this.state.suggestTagCombatant && (
          <TagSuggestor
            targetCombatant={this.state.suggestTagCombatant}
            activeCombatantId={this.props.encounterState.ActiveCombatantId}
            combatantNamesById={combatantNamesById}
            onApply={this.handleSuggestTagPrompt}
          />
        )}
        {this.state.showCombatStats && (
          <CombatStatsPopup stats={this.props.combatStats} />
        )}
        <PlayerViewCombatantHeader
          portraitColumnVisible={this.hasImages()}
          acColumnVisible={acColumnVisible}
        />

        {/*<InitiativeListHost tracker={this.props.tracker}/>*/}
        {/*<CenterColumn tracker={props.tracker} />*/}

        <ul className="combatants">
          {this.props.encounterState.Combatants.map(combatant => (
            <PlayerViewCombatant
              showPortrait={this.showPortrait}
              suggestDamage={this.openSuggestDamagePrompt}
              suggestTag={
                this.props.settings.AllowTagSuggestions &&
                this.openSuggestTagPrompt
              }
              combatant={combatant}
              areSuggestionsAllowed={this.props.settings.AllowPlayerSuggestions}
              portraitColumnVisible={this.hasImages()}
              acColumnVisible={acColumnVisible}
              colorVisible={this.props.settings.DisplayCombatantColor}
              isActive={
                this.props.encounterState.ActiveCombatantId == combatant.Id
              }
              key={combatant.Id}
            />
          ))}
        </ul>
        {footerVisible && (
          <CombatFooter
            timerVisible={this.props.settings.DisplayTurnTimer}
            currentRound={
              this.props.settings.DisplayRoundCounter
                ? this.props.encounterState.RoundCounter
                : undefined
            }
            activeCombatantId={this.props.encounterState.ActiveCombatantId}
          />
        )}
         {conditionsCurrent.length>0 && (
            <PlayerViewTags conditionsCurrent={conditionsCurrent} conditions={this.props.conditions}/>
     )}
      </div>
    );
  }

  public componentDidUpdate(prevProps: PlayerViewState) {
    this.splashPortraitIfNeeded(prevProps.encounterState.ActiveCombatantId);
    this.showCombatStatsIfNeeded(prevProps.combatStats);
    this.scrollToActiveCombatant();
  }

  private splashPortraitIfNeeded(previousActiveCombatantId) {
    if (!this.props.settings.SplashPortraits) {
      return;
    }

    const newCombatantIsActive =
      previousActiveCombatantId != this.props.encounterState.ActiveCombatantId;

    if (!newCombatantIsActive) {
      return;
    }

    if (this.state.portraitWasRequestedByClick) {
      return;
    }

    const newActiveCombatant = _.find(
      this.props.encounterState.Combatants,
      c => c.Id == this.props.encounterState.ActiveCombatantId
    );

    if (newActiveCombatant?.ImageURL.length) {
      this.setState({
        portraitURL: newActiveCombatant.ImageURL,
        portraitCaption: newActiveCombatant.Name,
        showPortrait: true,
        portraitWasRequestedByClick: false
      });
      this.modalTimeout = window.setTimeout(this.closeAllModals, 5000);
    }
  }

  private showCombatStatsIfNeeded(prevStats: CombatStats) {
    if (!this.props.combatStats) {
      return;
    }

    if (this.props.combatStats != prevStats) {
      this.setState({
        showCombatStats: true
      });
    }
  }

  private scrollToActiveCombatant() {
    const activeCombatantElement = document.getElementsByClassName("active")[0];
    if (activeCombatantElement?.scrollIntoView) {
      activeCombatantElement.scrollIntoView(false);
    }
  }

  private showPortrait = (combatant: PlayerViewCombatantState) => {
    if (!combatant.ImageURL) {
      return;
    }

    window.clearTimeout(this.modalTimeout);
    this.setState({
      portraitURL: combatant.ImageURL,
      portraitCaption: combatant.Name,
      showPortrait: true,
      portraitWasRequestedByClick: true
    });
  };

  private closeAllModals = () => {
    this.setState({
      showPortrait: false,
      showCombatStats: false,
      portraitWasRequestedByClick: false,
      suggestDamageCombatant: null,
      suggestTagCombatant: null
    });
  };

  private hasImages = () => {
    return (
      this.props.settings.DisplayPortraits &&
      this.props.encounterState.Combatants.some(c => c.ImageURL.length > 0)
    );
  };

  private openSuggestDamagePrompt = (combatant: PlayerViewCombatantState) => {
    if (!this.props.settings.AllowPlayerSuggestions) {
      return;
    }
    this.setState({
      suggestDamageCombatant: combatant
    });
  };

  private openSuggestTagPrompt = (combatant: PlayerViewCombatantState) => {
    if (!this.props.settings.AllowTagSuggestions) {
      return;
    }
    this.setState({
      suggestTagCombatant: combatant
    });
  };

  private handleSuggestDamagePrompt: ApplyDamageCallback = (
    combatantId,
    damageAmount
  ) => {
    this.closeAllModals();
    if (isNaN(damageAmount) || !damageAmount) {
      return;
    }
    this.props.onSuggestDamage(combatantId, damageAmount);
  };

  private handleSuggestTagPrompt: ApplyTagCallback = tagState => {
    const combatantId = this.state.suggestTagCombatant.Id;
    this.closeAllModals();
    if (tagState.Text.length == 0) {
      return;
    }
    this.props.onSuggestTag(combatantId, tagState);
  };
}
