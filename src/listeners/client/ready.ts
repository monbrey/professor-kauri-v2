import { Listener } from "discord-akairo";
import { readFileSync } from "fs";
import { join } from "path";
import { Settings } from "../../models/settings";
export default class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready"
    });
  }

  public async exec() {
    this.client.logger.info(`Logged in as "${this.client.user?.username}"`);

    const { version } = JSON.parse(readFileSync("package.json", "utf-8"));
    const devtech = this.client.channels.cache.get("420675341036814337");
    if (devtech?.isText()) devtech.send(`Restarted. Current version: ${version}`);

    for (const [guild_id, guild] of this.client.guilds.cache) {
      if (!this.client.settings?.has(guild_id)) {
        const config = await Settings.create({ guild_id, commands: [] });
        this.client.settings?.set(guild_id, config);
      }
    }
  }
}
