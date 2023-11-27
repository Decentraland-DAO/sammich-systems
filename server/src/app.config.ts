import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { matchMaker } from "colyseus"

/**
 * Import your Room files
 */
import {GameRoom} from "./rooms/GameRoom";
import {createRoom} from "@colyseus/core/build/MatchMaker";
import {PrismaClient} from "@prisma/client";
import {Express} from "express";
import {getCatchResponseError} from "./express-util";
import {tryFn} from "../../lib/functional";
const prisma = new PrismaClient();


export default config({

    initializeGameServer: (gameServer) => {
        console.log("initializeGameServer");
        /**
         * Define your room handlers:
         */
        const room = gameServer.define('GameRoom', GameRoom);
        matchMaker.createRoom("GameRoom", {});
    },

    initializeExpress: (app) => {
        app.get("/api/played-games/:from", async (req, res) => {
            tryFn(async ()=>{
                const pageSize = req.query.pageSize || 100;
                const rows = await prisma.playedMatch.findMany({
                    take:Number(pageSize),
                    where:{
                        ID:{gte:Number(req.params.from)}
                    }
                });
                const lastPlayedGameId = (await prisma.playedMatch.findFirst({orderBy:{ID:"desc"}})).ID;
                res.send({
                    results:rows,
                    lastPlayedGameId
                });
            }, getCatchResponseError(res));
        });

        app.get("/api/last-played-game-id", async (req, res) => {
            const lastPlayedGameId = (await prisma.playedMatch.findFirst({orderBy:{ID:"desc"}})).ID;
            return res.send(lastPlayedGameId)
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)

        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }         */

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * //TODO Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
