import { ArgumentCollector, CommandMessage } from "discord.js-commando";

const confirm = async function(msg: CommandMessage, prompt: string, timeout?: number): Promise<boolean> {
    const key = "confirm";
    const ac = new ArgumentCollector(msg.client, [{
        "key": key,
        "label": "answer",
        "prompt": prompt,
        "type": "boolean",
        "wait": timeout
    }], 1);

    const result = await ac.obtain(msg);
    if (result.cancelled) return false;
    return (result.values[key] != null) ? result.values[key] : false;
}

export { confirm };
