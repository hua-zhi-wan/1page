import { VercelRequest, VercelResponse } from '@vercel/node';
import { nanoid } from 'nanoid';
import { dbclient } from './dbclient';
import { Timestamp } from 'mongodb';

module.exports = async (request: VercelRequest, response: VercelResponse) => {
    let { content } = request.body;
    const db = dbclient.db('onepage').collection('pages');
    const slug = nanoid(12);
    const currentTime = new Date();

    await db.insertOne({
        content: content,
        slug: slug,
        timestamp: Timestamp.fromBits(currentTime.getTime() / 1000, 0)
    });
    return response.json({
        msg: `创建临时页面 #${slug} 成功！`,
        slug: slug
    });
}