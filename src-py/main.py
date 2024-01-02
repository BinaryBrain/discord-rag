import pdb
import nextcord
from nextcord.ext import commands
import json
import sys

token = "TOKEN"
guild = 0

bot = commands.Bot()

messages = []

@bot.event
async def on_ready():
  print(f'We have logged in as {bot.user}')
  
  print(sys.argv[1])
  channel = bot.get_channel(int(sys.argv[1]))
  
  if channel is None:
    print("Channel not found")
    return

  print(channel.name)
  
  async for message in channel.history(oldest_first=True, limit=None):
    messages.append(msg_to_dict(message))

  with open("output/" + channel.guild.name + '-' + channel.name + ".json", "a") as file:
    file.write(json.dumps(messages, indent=4))

  print(len(messages))
  await bot.close()
  exit(0)

def msg_to_dict(m):
  d = {
    "id": m.id,
    "type": m.type,
    "created_at": m.created_at.isoformat(),
    "content": m.content,
    "clean_content": m.clean_content,
    "jump_url": m.jump_url,
    "author": {
      "id": m.author.id,
      "name": m.author.name,
      "global_name": m.author.global_name,
    },
  }

  if m.type == nextcord.MessageType.reply:
    d["reference"] = {
      "message_id": m.reference.message_id,
      "channel_id": m.reference.channel_id,
      "guild_id": m.reference.guild_id,
    }

  if len(m.attachments) > 0:
    d["attachments"] = []
    for att in m.attachments:
      d["attachments"].append({
        "id": att.id,
        "content_type": att.content_type,
        "url": att.url,
        "proxy_url": att.proxy_url,
      })
  
  return d

bot.run(token)
