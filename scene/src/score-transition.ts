import {TextAlignMode} from "@dcl/sdk/ecs";
import {Color4} from "@dcl/sdk/math";
import {sleep} from "../dcl-lib/sleep";
import {DEFAULT_SPRITE_DEF} from "../../lib/sprite-constants";
const WINNER_POSITIONS = [
    [4,10],//player1
    [100,10]//player2
];
const SUM_SCORE_TEXT_POSITIONS =[
    [(192 / 4) , 128 / 4 - 16],//player1
    [(192 / 4) * 3 , 128 / 4 - 16]//player2
];

export function createGlobalScoreTransition(screen:any){
    const winnerSprite = screen.addSprite({
        spriteDefinition:{
            ...DEFAULT_SPRITE_DEF,
            x:388, y:473,
            w:128, h:28
        },
        pixelPosition:[100,10],
        layer:3
    });
    //winnerSprite.hide()
    const loserSprite = screen.addSprite({
        spriteDefinition:{
            ...DEFAULT_SPRITE_DEF,
            x:433, y:397,
            w:62, h:21
        },
        pixelPosition:[4,10],
        layer:3
    });
    //loserSprite.hide();
    const textColor = [0,0,0,1];
    const player1GlobalScoreBig = screen.addText({
        pixelPosition:[192/4,128/4],
        textAlign:TextAlignMode.TAM_MIDDLE_CENTER,
        text:"0",
        fontSize:2,
        textColor,
        layer:3
    });
    const winnerSumPointsText = screen.addText({
        pixelPosition:SUM_SCORE_TEXT_POSITIONS[0],
        textAlign:TextAlignMode.TAM_MIDDLE_CENTER,
        text:"+1",
        fontSize:1,
        textColor,
        layer:3
    })
    const player2GlobalScoreBig = screen.addText({
        pixelPosition: [(192 / 4) * 3, 128 / 4],
        textAlign:TextAlignMode.TAM_MIDDLE_CENTER,
        text:"0",
        fontSize:2,
        textColor,
        layer:3
    });

    const finalSprite = screen.addSprite({
        pixelPosition:[0,0],
        spriteDefinition:{
            ...DEFAULT_SPRITE_DEF,
            x:192, y:128,
            w:192, h:128
        },
        layer:2,
        zoom:[1,1]
    });
    finalSprite.hide();

    return {
        destroy:()=>{
            //TODO
        },
        hide:()=>{
            winnerSprite.hide();
            loserSprite.hide();
            player1GlobalScoreBig.hide();
            winnerSumPointsText.hide();
            player2GlobalScoreBig.hide();
        },
        showTransition:async ({winnerIndex, previousScore, trackWinnerIndex, displayName1, displayName2, isFinal}:any)=>{
            winnerSprite.show();
            loserSprite.show();
            player1GlobalScoreBig.show();
            player2GlobalScoreBig.show();

            await sleep(1000);

            if(winnerIndex === 0){
                winnerSumPointsText.setPixelPosition(...SUM_SCORE_TEXT_POSITIONS[0]);

                winnerSumPointsText.show();
                await sleep(1000);
                winnerSumPointsText.hide();
                player1GlobalScoreBig.setText((previousScore+1).toString());
            }else if(winnerIndex === 1){
                winnerSumPointsText.setPixelPosition(...SUM_SCORE_TEXT_POSITIONS[1]);
                winnerSumPointsText.show();
                await sleep(1000);
                winnerSumPointsText.hide();
                player2GlobalScoreBig.setText((previousScore+1).toString());
            }
            await sleep(2000);

            if(isFinal){
                finalSprite.show();
                finalSprite.setZoom([trackWinnerIndex?-1:1,1]);
                await sleep(5000);
                finalSprite.hide();
            }
        },
        reset:()=>{
            player1GlobalScoreBig.setText("0");
            player2GlobalScoreBig.setText("0");
        }
    }
}