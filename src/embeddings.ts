import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();
const vectorFolder = "../vectors";

export type Entry = {
  vector: number[];
  text: string;
  filename: string;
  channel: string;
  link: string;
  score?: number;
}

export type Source = {
  text: string;
  filename: string;
}

export type SearchResult = {
  result: string;
  sources: {
    filename: string;
    channel: string;
    link: string;
  }[];
}

const storage: Entry[] = [];

export async function createEmbedding(input: string): Promise<OpenAI.Embeddings.CreateEmbeddingResponse> {
    return openai.embeddings.create({
    input,
    model: "text-embedding-ada-002",
  });
}

export async function getVector(input: string): Promise<number[]> {
  return (await createEmbedding(input)).data[0].embedding;
}

function cosineSimilarity(v, w): number {
  let dotProduct = 0;

  for (let i = 0; i < v.length; i++) {
    dotProduct += v[i] * w[i];
  }

  return dotProduct;
}

export function store(name: string, vector: number[], text: string, filename: string, channel: string, link: string): void {
  const fileName = `${vectorFolder}/${name}.json`;
  const data = { filename, channel, link, text, vector };
  fs.writeFileSync(fileName, JSON.stringify(data));
  storage.push(data);
}

export function loadVectors(): void {
  const files = fs.readdirSync(vectorFolder);
  for (const file of files) {
    const entry = JSON.parse(fs.readFileSync(`${vectorFolder}/${file}`, "utf8"));
    storage.push(entry);
  }

  console.log(`Loaded ${storage.length} vectors`);
}

export function search(vector): SearchResult {
  for (const entry of storage) {
    entry.score = cosineSimilarity(entry.vector, vector);
  }

  storage.sort((a, b) => b.score - a.score);

  const result = storage.slice(0, 3).map(s => s.text).join('\n\n');
  const sources = storage.slice(0, 3).map(s => ({ filename: s.filename, channel: s.channel, link: s.link }));

  return { result, sources };
}
