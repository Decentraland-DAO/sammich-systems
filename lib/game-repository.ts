import {SammichGame} from "../games/sammich-game";
import {DifferenceGame} from "../games/difference-game";
import {FrogGame} from "../games/frog-game";
import {AttackGame} from "../games/attack-game";

const games = new Map();

export const setupGameRepository = () => {
    games.set(1, SammichGame);
    games.set(2, DifferenceGame);
    games.set(3, FrogGame);
    games.set(4, AttackGame);

    console.log("game id's", Array.from(games.keys()));
}

export const getGame = (id:number) => games.get(id)

