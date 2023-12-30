import axios from "axios";
import { TOKEN, APP_ID, PUBLIC_KEY } from "../secret";

const discord = axios.create({
  baseURL: 'https://discord.com/api',
  timeout: 5000,
  headers: {'Authorization': `Bot ${TOKEN}`}
});

discord.interceptors.response.use((response) => response, (err) => {
  console.log(err.response.status, err.response.statusText, err.response.data);
});

// /channels/{channel.id}/messages/{message.id}
// discord.get("/channels/685244471528783875/messages?limit=2").then((res) => {
discord.get("/guilds/147046705513234432/channels").then((res) => {
  console.log(res.status);
  console.log(res.data.filter((channel: any) => channel.type === 0))
})

discord.get("/channels/147048208969760769/messages?limit=2").then((res) => {
  console.log(res.status);
  console.log(res.data.filter((channel: any) => channel.type === 0))
})

/*
discord.get("/users/@me").then((res) => {
  console.log(res.status);
  console.log(res.data);
});
*/