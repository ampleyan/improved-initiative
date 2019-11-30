import React = require("react");
import { HpVerbosityOption } from "../../../common/PlayerViewSettings";
import {
  AutoGroupInitiativeOption,
  AutoRerollInitiativeOption,
  PostCombatStatsOption
} from "../../../common/Settings";
import { Info } from "../../Components/Info";
import { Dropdown } from "./Dropdown";
import { Toggle } from "./Toggle";

interface OptionsSettingsProps {
  goToEpicInitiativeSettings: () => void;
}
export class OptionsSettings extends React.Component<OptionsSettingsProps> {
  public render() {
    return (
      <div className="tab-content options">
        <h3>Rules</h3>
        <Toggle fieldName="Rules.RollMonsterHp">
          Roll HP when adding a Creature from Library Pane
          <Info>
            When you add a Creature from your Library, its Hit Point Maximum
            will be generated by rolling the dice expression in the Hit Points
            detail section.
          </Info>
        </Toggle>
        <Toggle fieldName="Rules.EnableBossAndMinionHP">
          Show Boss and Minion buttons on Library Creatures
          <Info>
            Hover or preview a Creature in the Library Pane to reveal these
            buttons. The pawn icon will add a creature as a 1HP "minion" and the
            king icon will add it with the maximum possible HP roll.
          </Info>
        </Toggle>
        <Toggle fieldName="Rules.AllowNegativeHP">
          Allow combatants to have negative hit points
        </Toggle>
        <Toggle fieldName="Rules.AutoCheckConcentration">
          Automatically prompt for concentration checks
          <Info>
            When a combatant has a tag with the text "Concentrating", a prompt
            with a suggested concentration check will appear if they receive
            damage. You can ignore the prompt or automatically clear the tag.
          </Info>
        </Toggle>
        <Dropdown
          fieldName="Rules.AutoGroupInitiative"
          options={AutoGroupInitiativeOption}
        >
          Automatically add creatures to initiative group
          <Info>
            Creatures in an initiative group will act on the same initiative
            count. The group keeps its initiative count in sync when you roll or
            edit initiative, but you can unlink individual members.
          </Info>
        </Dropdown>
        <Dropdown
          fieldName="Rules.AutoRerollInitiative"
          options={AutoRerollInitiativeOption}
        >
          Automatically reroll initiative each round
        </Dropdown>

        <h3>Encounter View</h3>
        <Toggle fieldName="TrackerView.DisplayRoundCounter">
          Display Round Counter
        </Toggle>
        <Toggle fieldName="TrackerView.DisplayTurnTimer">
          Display Turn Timer
        </Toggle>
        <Toggle fieldName="TrackerView.DisplayDifficulty">
          Display Encounter Difficulty
        </Toggle>
        <Dropdown
          fieldName="TrackerView.PostCombatStats"
          options={PostCombatStatsOption}
        >
          Display Post-Combat Stats Summary
        </Dropdown>

        <h3>Player View</h3>
        <Toggle fieldName="PlayerView.DisplayRoundCounter">
          Display Round Counter
        </Toggle>
        <Toggle fieldName="PlayerView.DisplayTurnTimer">
          Display Turn Timer
        </Toggle>
        <Dropdown
          fieldName="PlayerView.MonsterHPVerbosity"
          options={HpVerbosityOption}
        >
          Non Player Character HP Verbosity
        </Dropdown>
        <Dropdown
          fieldName="PlayerView.PlayerHPVerbosity"
          options={HpVerbosityOption}
        >
          Player Character HP Verbosity
        </Dropdown>
        <Toggle fieldName="PlayerView.HideMonstersOutsideEncounter">
          Don't show NPCs in Player View until encounter is started
        </Toggle>
        <Toggle fieldName="PlayerView.AllowPlayerSuggestions">
          Allow players to suggest damage/healing
        </Toggle>
        <Toggle fieldName="PlayerView.ActiveCombatantOnTop">
          Active combatant at top of initiative list
        </Toggle>
        <p>
          {"Additional player view options available with "}
          <a href="#" onClick={this.props.goToEpicInitiativeSettings}>
            Epic Initiative
          </a>
        </p>
      </div>
    );
  }
}
