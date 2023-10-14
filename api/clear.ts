import { VercelRequest, VercelResponse } from "@vercel/node";
import { dbclient } from "./dbclient";
import { Timestamp } from "mongodb";

module.exports = async (request: VercelRequest, response: VercelResponse) => {
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - 8);
    const hoursAgoTimestamp = Timestamp.fromBits(hoursAgo.getTime() / 1000, 0);


    await dbclient.db('onepage').collection('pages').deleteMany({
        timestamp: {
            $lt: hoursAgoTimestamp
        }
    });
    return response.json({
        msg: "Rows are already deleted."
    });
}