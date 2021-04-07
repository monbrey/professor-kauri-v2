import { Collection, CommandInteraction, MessageEmbed } from "discord.js";
import { InteractionCommand } from "../../lib/commands/InteractionCommand";
import { CommandExecutionError } from "../../lib/misc/CommandExecutionError";

export default class extends InteractionCommand {
  constructor() {
    super("rse", {
      name: "rse",
      description: "Get RSE Contest data for a move",
      options: [{
        name: "move",
        description: "Name of the move to search for",
        type: "STRING",
        required: true
      }],
    });
  }


  public async exec(interaction: CommandInteraction) {
    const query = interaction.options.find(o => o.name === "move")?.value as string;
    if (!query) throw new CommandExecutionError("Command parameter 'move' not found");

    const { value } = await this.client.urpg.attack.fetchClosest(query);
    if (!value) throw new CommandExecutionError(`No move found matching \`${query}\``);

    this.client.logger.info({
      key: interaction.commandName,
      query,
      result: value.name
    });

    const { rseContestAttribute: attribute, rseContestMoveType: { score, jam, description } } = value;

    const embed = new MessageEmbed()
      .setTitle(value.name)
      .addField(`| Attribute: ${attribute} | Score: ${score > 0 ? `+${score}` : `${score}`} | Jam: ${jam} |`, description);

    return interaction.reply(embed);
  }
}