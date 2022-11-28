import type { CommandInteraction } from 'discord.js'
import { Discord, Slash, } from 'discordx'
import { RedisManager } from '../RedisManager.js'

@Discord()
export class GetScore {
  @Slash({ description: 'Display your score', name: 'score' })
  async score (command: CommandInteraction): Promise<void> {
    await command.deferReply()

    const user = command.options.getUser('user') || command.user

    const redisInstance = RedisManager.getInstance()
    const channelId = command.channelId
    const userId = user.id

    const currentScore = await redisInstance.zscore(`score:${channelId}`, userId)
    if (currentScore !== null) {
      await command.editReply(`Your current score is ${currentScore}`)
    } else {
      await command.editReply('You have no score yet...')
    }
  }
}


