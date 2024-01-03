import fs from "fs";
import { Message } from "./types/message";
import { getVector, store } from "./embeddings";
import { Chunk } from "./types/chunk";
import { encoding_for_model } from "tiktoken";

let messages: Message[][] = [];

async function main() {
  await loadJsonFolder("../output/text");
  await loadJsonFolder("../output/voice");

  for (const channel in messages) {
    console.log(channel);
    const chunkPerDay = messagesToChucks(messages[channel], channel);

    for (let i = 0; i < chunkPerDay.length - 2; i++) {
      const texts: string[] = [...chunkPerDay[i].texts, ...chunkPerDay[i + 1].texts, ...chunkPerDay[i + 2].texts];
      const date = `${chunkPerDay[i].startDate.getUTCFullYear()}-${chunkPerDay[i].startDate.getUTCMonth() + 1}-${chunkPerDay[i].startDate.getUTCDate()}`;
      const name = `fnu_${channel}_${date}`;
      await processText(texts, name, channel, chunkPerDay[i].firstLink);
    }
  }
}

async function processText(texts: string[], name: string, channel: string, url: string) {
  const chat = texts.join('\n');
  if (countTokens(chat) < 8000) {
    const vector = await getVector(chat);
    store(name, vector, chat, name, channel, url);
  } else {
    const t1 = texts.slice(0, Math.floor(texts.length / 2));
    const t2 = texts.slice(Math.floor(texts.length / 2));
    processText(t1, name + '_1', channel, url);
    processText(t2, name + '_2', channel, url);
  }
}

function countTokens(text: string): number {
  const enc = encoding_for_model("text-davinci-003");
  const e = enc.encode(text);
  return e.length;
}

async function loadJsonFolder(path: string) {
  const files = fs.readdirSync(path);

  for (const file of files) {
    const newMessages = JSON.parse(fs.readFileSync(`${path}/${file}`, "utf8"));
    const chan = file.substring(4).slice(0, -5);

    for (let i = 0; i < newMessages.length; i++) {
      newMessages[i].channel = chan;
    }

    messages[chan] = newMessages;
  }
}

function messagesToChucks(messages: Message[], channel: string): Chunk[] {
  const chunkPerDay: Chunk[] = [];

  let prevDate;
  let i = -1;
  messages.forEach(m => {
    const date = new Date(m.created_at).toDateString();

    if (prevDate === date) {
      chunkPerDay[i].texts.push(messageToString(m));
    } else {
      i++;
      prevDate = date;
      chunkPerDay[i] = {
        texts: [messageToString(m)],
        channel,
        firstLink: m.jump_url,
        startDate: new Date(m.created_at),
      }
    }
  });

  return chunkPerDay;
}

function messageToString(m: Message) {
  return `${m.author.global_name ?? m.author.name}: ${m.clean_content}`;
}

main();
