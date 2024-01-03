import { SearchResult, getVector, loadVectors, search } from "./embeddings";
import { chat } from "./prompt";

async function main() {
  loadVectors();
  console.log("Prompting...");
  const prompt = process.argv[2];
  const vector = await getVector(prompt);
  const searchResult: SearchResult = search(vector);
  const text = await chat(prompt, searchResult.result);
  console.log(text);
  console.log(searchResult.sources);
}

main();