import { Interaction } from "discord.js";

type PetalInteractionData = {
    handler: Function,
    linked_user: string | null,
    single: boolean,
    custom_id: string
}

export default class PetalInteractionManager {
    
    interactions: { string: PetalInteractionData } | {};

    /**
     * InteractionManager constructor
     */
    constructor() {
        this.interactions = {};
        setInterval(() => {

            for(let [key, value] of Object.entries(this.interactions)) {

                let registered = (value as any).registered;
                
                if(!registered) {
                    console.warn(`No registered time for ${key}.`);
                    continue;
                }

                if(Date.now() - registered > (5 * 60 * 1000)) delete (this.interactions as any) [key];

            }

        }, 30 * 1000)
    }

    /**
     * Registers an interaction
     * @param handler 
     * @param custom_id 
     * @returns 
     */
    register_interaction = (handler: Function, linked_user: string | null, single: boolean, custom_id?: string): string => {
        
        let id = custom_id || this.generate_token();
        (this.interactions as any) [id] = {
            handler,
            linked_user,
            single: single,
            registered: Date.now()
        }

        return id;

    }

    /**
     * Handles an interaction
     * @param interaction Interaction data
     */
    handle_interaction = (interaction: Interaction): void => {

        if(!(interaction as any).customID) {

            // Handle action if un-registered
            if((interaction as any).deferUpdate) (interaction as any).deferUpdate();
            return;

        };
        
        let data = ((this.interactions as any) [(interaction as any).customID] as PetalInteractionData |null);

        if(!data) return (interaction as any).deferUpdate();
        if(data.linked_user ? data.linked_user != interaction.user.id : false) return (interaction as any).deferUpdate();

        data.handler(interaction);
        if(data.single) delete (this.interactions as any) [(interaction as any).customID];

    }

    /**
     * Generates an unused token (custom_id)
     * @returns Unused token
     */
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
