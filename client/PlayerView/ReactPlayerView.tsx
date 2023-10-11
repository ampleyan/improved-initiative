import * as React from "react";
import { render as renderReact } from "react-dom";
// import { TrackerViewModel } from "../TrackerViewModel"

import { CombatStats } from "../../common/CombatStats";
import { TagState } from "../../common/CombatantState";
import { EncounterState } from "../../common/EncounterState";
import { PlayerViewCombatantState } from "../../common/PlayerViewCombatantState";
import { PlayerViewSettings } from "../../common/PlayerViewSettings";
import { PlayerViewState } from "../../common/PlayerViewState";
import { getDefaultSettings } from "../../common/Settings";
import { PlayerView } from "./components/PlayerView";
import axios from "axios";
import { Socket } from "socket.io-client";
import {TrackerViewModel} from "../TrackerViewModel";
import {ApplyDamageCallback} from "./components/DamageSuggestor";
import {ConditionReferencePrompt} from "../Prompts/ConditionReferencePrompt";
import {Library} from "../Library/useLibrary";
import {StatBlock} from "../../common/StatBlock";
import {ListingMeta} from "../../common/Listable";
import {ImportOpen5eStatBlock} from "../Importers/Open5eImporter";

export interface OwnProps {
  tracker?: TrackerViewModel;
}

export interface viewProps {
  element?: Element;
  encounterId?:string;
}
// export type PlayerViewProps = viewProps & OwnProps;
async function preloadConditions() {
  try {
    const response = await axios.get("/open5e/conditions/");
    const open5eListings: ListingMeta[] = response.data;
    return open5eListings
  } catch (error) {}
}

export class ReactPlayerView extends React.Component<OwnProps, viewProps>{
  private playerViewState: PlayerViewState;
  private socket: Socket;
  // private viewState: viewProps;
  // private tracker: TrackerViewModel

  constructor(props) {
    super(props);
    // this.encounterId=props.encounterId
    this.state = props
    this.state['tags'] = []
    this.state['conditions'] = []
    let conditions = []
     preloadConditions().then(res=> conditions = res)
    this.renderPlayerView({
      encounterState: EncounterState.Default<PlayerViewCombatantState>(),
      settings: getDefaultSettings().PlayerView,
      conditions: conditions
      // tracker: props.tracker
    });




  }

  public async LoadEncounterFromServer() {
    try {
      const playerView: PlayerViewState = await axios
        .get(`../playerviews/${this.state.encounterId}`)
        .then(r => r.data);
      playerView.encounterState =
        playerView.encounterState ||
        EncounterState.Default<PlayerViewCombatantState>();
      playerView.settings =
        playerView.settings || getDefaultSettings().PlayerView;
      this.renderPlayerView(playerView);
    } catch (e) {}
  }

  public ConnectToSocket(socket: Socket) {
    this.socket = socket;
    this.socket.on(
      "encounter updated",
      (encounter: EncounterState<PlayerViewCombatantState>) => {
        this.renderPlayerView({
          encounterState: encounter,
          settings: this.playerViewState.settings,
          combatStats: this.playerViewState.combatStats,
        });
      }
    );
    this.socket.on("settings updated", (settings: PlayerViewSettings) => {
      this.renderPlayerView({
        encounterState: this.playerViewState.encounterState,
        settings: settings,
        combatStats: this.playerViewState.combatStats
      });
    });
    this.socket.on("combat stats", (stats: CombatStats) => {
      this.renderPlayerView({
        encounterState: this.playerViewState.encounterState,
        settings: this.playerViewState.settings,
        combatStats: stats
      });
    });

    this.socket.emit("join encounter", this.state.encounterId);
  }

  private async renderPlayerView(newState: PlayerViewState) {
    console.log(this.props)
    this.playerViewState = newState;
     let conditions = await preloadConditions()
    // if (newState.encounterState.Combatants.length > 0) {
    //   newState.encounterState.Combatants.map(combatant => {
    //     if (combatant.Tags.length > 0) {
    //       this.state['tags'].push(...combatant.Tags.map(v=>v.Text))
    //     }
    //   })
    //
    //
    // this.state['conditionsCurrent'] =  conditions.filter(v=> this.state['tags'].indexOf(v['name'])>-1)
    // }

    renderReact(
        <PlayerView
            encounterState={this.playerViewState.encounterState}
            settings={this.playerViewState.settings}
            combatStats={this.playerViewState.combatStats}
            conditionsCurrent={this.state['conditionsCurrent']}
            conditions={conditions}
            onSuggestDamage={this.suggestDamage}
            onSuggestTag={this.suggestTag}
        />,
        this.state.element
    );
  }

  private suggestDamage = (combatantId: string, damageAmount: number) => {
    if (!this.socket) {
      throw "Player View not attached to socket";
    }
    this.socket.emit(
      "suggest damage",
      this.state.encounterId,
      [combatantId],
      damageAmount,
      "Player"
    );
  };

  private suggestTag = (combatantId: string, tagState: TagState) => {
    if (!this.socket) {
      throw "Player View not attached to socket";
    }
    this.socket.emit(
      "suggest tag",
      this.state.encounterId,
      [combatantId],
      tagState,
      "Player"
    );
  };
}
