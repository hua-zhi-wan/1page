import { VercelRequest, VercelResponse } from '@vercel/node';
import { nanoid } from 'nanoid';
import { dbclient } from './dbclient';
import { Timestamp } from 'mongodb';
import { createHash } from 'crypto';

module.exports = async (request: VercelRequest, response: VercelResponse) => {
    let { content } = request.body;
    content = content.trim();
    const db = dbclient.db('onepage').collection('pages');
    const slug = nanoid(12);
    const currentTime = new Date();

    const hash = createHash('md5').update(content).digest('hex');

    const history = await db.findOne({ hash });
    if (history) {
        return response.json({
            msg: `已存在临时界面 #${history.slug}`,
            slug: history.slug
        });
    }

    await db.insertOne({
        content: content,
        slug: slug,
        timestamp: Timestamp.fromBits(currentTime.getTime() / 1000, 0),
        hash: hash
    });
    return response.json({
        msg: `创建临时页面 #${slug} 成功！`,
        slug: slug
    });
}