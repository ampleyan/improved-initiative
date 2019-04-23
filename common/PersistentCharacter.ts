import { now } from "moment";
import { StatBlock } from "./StatBlock";

export interface PersistentCharacter {
  Id: string;
  Version: string;
  Name: string;
  Path: string;
  LastUpdateMs: number;
  CurrentHP: number;
  StatBlock: StatBlock;
  Notes: string;
}

export namespace PersistentCharacter {
  export function Initialize(statBlock: StatBlock): PersistentCharacter {
    return {
      Id: statBlock.Id,
      Version: statBlock.Version,
      Name: statBlock.Name,
      Path: statBlock.Path,
      LastUpdateMs: now(),
      CurrentHP: statBlock.HP.Value,
      StatBlock: statBlock,
      Notes: ""
    };
  }

  export const Default = () => Initialize(StatBlock.Default());

  export const GetSearchHint = (character: PersistentCharacter) =>
    character.StatBlock.Type;

  export const GetMetadata = (character: PersistentCharacter) => ({
    Level: GetTotalLevelFromString(character.StatBlock.Challenge)
  });

  const GetTotalLevelFromString = (levelString: string) => {
    const matches = levelString.match(/\d+/g);
    if (!matches) {
      return "";
    }

    return matches
      .reduce((total, digitMatch) => {
        const level = parseInt(digitMatch);
        if (level != NaN) {
          return total + level;
        }
        return total;
      }, 0)
      .toString();
  };
}
