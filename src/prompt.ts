import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI();

export async function chat(prompt: string, documents: string): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [{
  role: "system",
  content:
  //  `You're a Discord assistant and you try to guess the answer from "Binary Brain" as best as possible
  //  using the user's one style. Do not try to invent anything. Stick the the user style of writing.
  //  You base your knowledge on chat extracts provided by the user.`
    `You're a Discord assistant and you try to guess rest of the conversation as best as possible
    using the users's style. Do not try to invent anything. Stick the the users style of writing.
    You base your knowledge on chat extracts provided by the user.`
  },
  {
    role: "user",
    content: `Here is some chat extracts that may help you: \n${documents}`
  },
  {
    role: "user",
    content: prompt
  },
  {
    role: "user",
    content: "Try to guess the conversation in the same style:"
  }];

  const completion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
  });

  return completion.choices[0].message.content;
}
