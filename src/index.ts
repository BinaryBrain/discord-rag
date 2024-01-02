import fs from "fs";
import { Message } from "./types/message";

let messages: Message[][] = [];

async function main() {
  await loadJsonFolder("../output/text");
  await loadJsonFolder("../output/voice");

  const texts: Message[][][] = [];
  for (const ms in messages) {
    console.log(ms);
    texts[ms] = messagesToTextPerDay(messages[ms]);
  }

  console.log(texts);
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

function messagesToTextPerDay(messages: Message[]) {
  const messagesPerDay: Message[][] = [];

  messages.forEach(m => {
    const d = new Date(m.created_at);
    const date = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
    if (messagesPerDay[date]) {
      messagesPerDay[date].push(messageToString(m));
    } else {
      messagesPerDay[date] = [messageToString(m)];
    }
  });

  return messagesPerDay;
}

function messageToString(m: Message) {
  return `${new Date(m.created_at).toLocaleString()} - ${m.author.global_name ?? m.author.name}: ${m.clean_content}`;
}

main();
