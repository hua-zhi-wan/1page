import { VercelRequest, VercelResponse } from "@vercel/node";
import { dbclient } from "./dbclient";

module.exports = async (request: VercelRequest, response: VercelResponse) => {
    const { slug } = request.query;
    const result = await dbclient.db('onepage').collection('pages').findOne({ slug });
    if (result) {
        return response.json({
            content: result.content
        });
    }
    else {
        return response.status(400).json({ msg: 'undefined slug' });
    }
}