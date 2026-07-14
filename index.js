import { Client, Collection } from "discord.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { AntiCrashHandler } from "./handlers/antiCrashHandler.js";

const client = new Client({ intents: [32767, 130685] });

client.events = new Collection();
client.commands = new Collection();
client.contexts = new Collection();
client.buttons = new Collection();
client.selects = new Collection();
client.modals = new Collection();

await AntiCrashHandler(client);
await loadEvents(client);

await client.login(process.env.token);

