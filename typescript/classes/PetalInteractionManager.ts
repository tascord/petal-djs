import { Interaction } from "discord.js";

export default class PetalInteractionManager {
    
    interactions: {};

    constructor() {
        this.interactions = {};
    }

    add_interaction = (handler: Function, custom_id?: string): string => {
        
        let id = custom_id || this.generate_token();
        (this.interactions as any) [id] = handler;

        return id;

    }

    handle_interaction = (interaction: Interaction): void => {

        if(!(interaction as any).customID) return;
        
        let handler = (this.interactions as any) [(interaction as any).customID];
        if(handler) handler(interaction);

    }

    generate_token = (): string => {

        let token: string;

        do {
            token = 'petal_xxxxxxxxxx'.replace(/x/g, () => {
                return Math.floor(Math.random() * 11).toString()
            });
        }

        while (
            (this.interactions as any) [token]
        )

        return token;

    }

}
