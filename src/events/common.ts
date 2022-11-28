import type { ArgsOf, Client } from 'discordx'
import { Discord, On } from 'discordx'
import { RedisManager } from '../RedisManager.js'

@Discord()
export class Example {
  @On()
  async messageCreate ([message]: ArgsOf<'messageCreate'>, _client: Client): Promise<void> {
    if (message.author.bot) return
    const redisInstance = RedisManager.getInstance()
    const channelId = message.channel.id
    const userId = message.author.id

    await redisInstance.zincrby(`score:${channelId}`, 1, userId)

    // get user score
    const currentScore = await redisInstance.zscore(`score:${channelId}`, userId)
    if (currentScore !== null && (Number(currentScore) % 10 === 0)) {
      await message.reply(`Your current channel score is ${currentScore}`)
    }
  }
}
