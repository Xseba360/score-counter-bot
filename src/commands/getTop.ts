import type { CommandInteraction } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import { Discord, Slash, } from 'discordx'
import { RedisManager } from '../RedisManager.js'

@Discord()
export class GetScore {
  @Slash({ description: 'Get top scores for this channel', name: 'top' })
  async top (command: CommandInteraction): Promise<void> {
    await command.deferReply()

    const redisInstance = RedisManager.getInstance()
    const channelId = command.channelId

    // get top10 users from zset
    const top10Users = await redisInstance.zrevrange(`score:${channelId}`, 0, 9, 'WITHSCORES')
    const top10UserNames = await Promise.all(top10Users.map(async (userId, index) => {
      if (index % 2 === 0) {
        const position = index / 2 + 1
        return `\`${position < 10 ? ' ' : ''}${position}.\` <@${userId}> - ${top10Users[index + 1]}`
      }
    }))
    const top10UserNamesFiltered = top10UserNames.filter((userName) => userName !== undefined)
    const embedDescription = top10UserNamesFiltered.join('\n')

    const embed = new EmbedBuilder()
      .setTitle('Top Scores')
      .setColor(0x00ff00)
      .setDescription(embedDescription)
    await command.editReply({ embeds: [embed] })
  }
}


