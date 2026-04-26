import { AspectRatio } from '@chub-ai/stages-ts';
import { SkitType } from './Skit';
import { SaveType, Stage } from "./Stage";
import Actor from './actors/Actor';
import Faction from './factions/Faction';
import { ScreenType } from './screens/BaseScreen';
import { Build, Hotel, Restaurant, Security, AttachMoney, Favorite } from '@mui/icons-material';

export type ModuleType = 'echo chamber' | 'scrying ball' | 'quarters' | 'feast hall' | 'torture chamber' | 'brothel' | 'Library' | 'Master's Study'
    
    | string; // Allow string for modded modules

export enum StationStat {
    MAGIC = 'Magic',
    COMFORT = 'Comfort',
    PROVISION = 'Provision',
    SECURITY = 'Security',
    HARMONY = 'Harmony',
    WEALTH = 'Wealth'
}

// Icon mapping for station stats
export const STATION_STAT_ICONS: Record<StationStat, any> = {
    [StationStat.MAGIC]: Build,
    [StationStat.COMFORT]: Hotel,
    [StationStat.PROVISION]: Restaurant,
    [StationStat.SECURITY]: Security,
    [StationStat.HARMONY]: Favorite,
    [StationStat.WEALTH]: AttachMoney,
};

export const STATION_STAT_DESCRIPTIONS: Record<StationStat, string> = {
    'Magic': 'Magical and structural health of the mansion',
    'Comfort': 'Overall comfort and livability for inhabitants',
    'Provision': 'Availability of food, water, and essential supplies',
    'Security': 'Safety and defense against external and internal threats',
    'Harmony': 'Social cohesion and morale among inhabitants',
    'Wealth': 'Financial resources of the station and its Master'
};

export function getStatRating(score: number): StatRating {
    if (score <= 2) {
        return StatRating.POOR;
    } else if (score <= 4) {
        return StatRating.BELOW_AVERAGE;
    } else if (score <= 6) {
        return StatRating.AVERAGE;
    } else if (score <= 8) {
        return StatRating.GOOD;
    } else {
        return StatRating.EXCELLENT;
    }
}

// Mapping of StationStat to a set of prompt additions based on the 1-10 rating of the stat
// 5 ratings: 1-2 (poor), 3-4 (below average), 5-6 (average), 7-8 (good), 9-10 (excellent)
export enum StatRating {
    POOR = 'poor',
    BELOW_AVERAGE = 'below average',
    AVERAGE = 'average',
    GOOD = 'good',
    EXCELLENT = 'excellent'
}
export const STATION_STAT_PROMPTS: Record<StationStat, Record<StatRating, string>> = {
    'Magic': {
        [StatRating.POOR]: 'The Mansion is plagued by frequent magical failures, unlit torches, and structural issues, making it barely operational.',
        [StatRating.BELOW_AVERAGE]: 'The Mansion experiences occasional magical problems and minor structural concerns that need attention.',
        [StatRating.AVERAGE]: 'The Mansion is generally functional with standard magic keeping systems operational, if finicky.',
        [StatRating.GOOD]: 'The Mansion runs smoothly with well-maintained magical bindings and minimal issues.',
        [StatRating.EXCELLENT]: 'The Mansion boasts state-of-the-art magic and impeccable structural integrity, operating flawlessly.'
    },
    'Comfort': {
        [StatRating.POOR]: 'Living conditions are harsh, filthy, and downright unhealthy, leading to widespread dissatisfaction among inhabitants.',
        [StatRating.BELOW_AVERAGE]: 'Living conditions are subpar, messy, and unpleasant, with many inhabitants feeling uneasy in their environment.',
        [StatRating.AVERAGE]: 'Living conditions and cleanliness are acceptable, providing a basic level of comfort for inhabitants.',
        [StatRating.GOOD]: 'The station offers a comfortable, clean, and pleasant living environment for its inhabitants.',
        [StatRating.EXCELLENT]: 'Inhabitants enjoy luxurious, impeccable, and healthful living conditions, enhancing their overall well-being.'
    },
    'Provision': {
        [StatRating.POOR]: 'Essential supplies are scarce, leading to frequent shortages and hardships for inhabitants.',
        [StatRating.BELOW_AVERAGE]: 'Provision levels are inconsistent, with occasional shortages of food, water, and supplies.',
        [StatRating.AVERAGE]: 'The station maintains a steady supply of essentials, meeting the basic needs of inhabitants.',
        [StatRating.GOOD]: 'Provision levels are reliable, ensuring inhabitants have access to necessary supplies without issue.',
        [StatRating.EXCELLENT]: 'The Mansion is abundantly stocked with essentials, providing more than enough for all inhabitants.'
    },
    'Security': {
        [StatRating.POOR]: 'The Mansion is vulnerable to threats, with inadequate defenses and frequent security concerns. Local government may have caught word of the Master and be taking steps to stop him.',
        [StatRating.BELOW_AVERAGE]: 'Security measures are weak, leading to occasional malfeasance and safety concerns among inhabitants. Wandering heroes may hear rumors of the Master and seek to challenge him.',
        [StatRating.AVERAGE]: 'The Mansion has standard security protocols in place; inhabitants may occasionally act out but are generally kept in check.',
        [StatRating.GOOD]: 'Security is robust, effectively protecting the Mansion and its inhabitants from threats.',
        [StatRating.EXCELLENT]: 'The Mansion boasts top-tier security systems, ensuring unparalleled safety and protection for all.'
    },
    'Harmony': {
        [StatRating.POOR]: 'Social tensions run high and morale is non-existent, leading to frequent conflicts and a toxic atmosphere among inhabitants.',
        [StatRating.BELOW_AVERAGE]: 'Harmony is lacking and morale is low, with noticeable divisions and occasional disputes among inhabitants.',
        [StatRating.AVERAGE]: 'The social environment is stable, with decent morale and generally peaceful coexistence.',
        [StatRating.GOOD]: 'A strong sense of community and high morale prevails, fostering good vibes and positive relationships among inhabitants.',
        [StatRating.EXCELLENT]: 'Inhabitants enjoy a harmonious and supportive social environment, thriving together in unity.'
    },
    'Wealth': { // Wealther is financial resources of the station and its Director and does not necessarily reflect the personal wealth of inhabitants nor the station's overall provision levels
        [StatRating.POOR]: 'Financial resources are critically low',
        [StatRating.BELOW_AVERAGE]: 'Wealth levels are low, leading to budget constraintss.',
        [StatRating.AVERAGE]: 'The Master maintains a stable financial footing.',
        [StatRating.GOOD]: 'The Master is financially healthy, with ample resources in reserve.',
        [StatRating.EXCELLENT]: 'The Master enjoys significant wealth, capable of lavish spending.'
    }
};

export interface ModuleIntrinsic {
    name: string;
    skitPrompt?: string; // Additional prompt text to influence the script in skit generation
    imagePrompt?: string; // Additional prompt text to describe the module in decor image generation
    role?: string;
    roleDescription?: string;
    baseImageUrl: string; // Base image that is used for theming through image2image calls
    defaultImageUrl: string; // Default themed version of the module
    cost: {[key in StationStat]?: number}; // Cost to build the module (StationStat name to amount)
    [key: string]: any; // Additional properties, if needed
    // Action method; each module has an action that will need to take the Module and Stage as contextual parameters:
    action?: (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => void;
    available?: (stage: Stage) => boolean;
}

const randomAction = (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => {
    // Maybe move the module's owner (if any) here (make sure they aren't located at a faction):
    const owner = module.ownerId ? stage.getSave().actors[module.ownerId] : undefined;
    if (owner && !owner.isOffSite(stage.getSave()) && Math.random() < 0.5) {
        owner.locationId = module.id;
    }

    stage.setSkit({
        type: SkitType.RANDOM_ENCOUNTER,
        moduleId: module.id,
        script: [],
        generating: true,
        context: {},
    });
    setScreenType(ScreenType.SKIT);
};

export const MODULE_TEMPLATES: Record<ModuleType, ModuleIntrinsic> = {
    'echo chamber': {
        name: 'Echo Chamber',
        skitPrompt: 'The echo chamber is where the player steals slaves from other realities using from the magic leyline. Scenes in this room typically involve newly echofused patients as they get their bearings.',
        imagePrompt: 'A medieval portal room',
        role: 'Assistant',
        roleDescription: `Manage station operations, monitoring the crew and supplementing their needs as the director's right hand.`,
        baseImageUrl: 'https://media.charhub.io/a6bfd218-4585-4070-8516-98b7137f4266/a5638c2e-5828-42c4-b579-bfe82892daee.png',
        defaultImageUrl: 'https://media.charhub.io/a6bfd218-4585-4070-8516-98b7137f4266/a5638c2e-5828-42c4-b579-bfe82892daee.png',
        cost: {}, // Free; starter module
        action: (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => {
            // Open the station management screen
            console.log("Opening echo screen from command module.");
            // Use Stage API so any mounted UI can react to the change
            setScreenType(ScreenType.ECHO);
        },
        available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'echo chamber').length === 0;
        }
    },
    Scrying Ball: {
        name: 'Scrying Ball',
        skitPrompt: `The Scrying Ball room is the hub for all external and internal Mansion communications. ` +
            `This room is critical for communicating with external factions, with whom the Mansion finds work for slaves or conducts trade in exchange for desired resources. ` +
            `Scenes here often involve receiving important messages, coordinating among the Mansion, or managing Mansion-wide announcements.`,
        imagePrompt: 'Magic Scrying ball sat upon a wooden table set in a medieval fantasy setting ',
        role: 'Vessel',
        roleDescription: `Handle all communications for the mansion, liaising with external entities and managing internal announcements.`,
        baseImageUrl: 'https://media.charhub.io/b4c18a4c-65e8-4c27-9ef7-5c400ed14e3d/0d82a080-49fb-42e7-b5db-127463f79d05.png',
        defaultImageUrl: 'https://media.charhub.io/b4c18a4c-65e8-4c27-9ef7-5c400ed14e3d/0d82a080-49fb-42e7-b5db-127463f79d05.png',
        cost: {}, // Free; starter module
        action: (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => {
            // If there is a rep from a faction here, open a faction interaction skit
            if (Object.values(stage.getSave().factions).some(a => a.representativeId && stage.getSave().actors[a.representativeId]?.locationId === module.id)) {
                const faction = Object.values(stage.getSave().factions).find(a => a.representativeId && stage.getSave().actors[a.representativeId]?.locationId === module.id);
                if (faction) {
                    // Move the module's owner (if any) here:
                    const owner = module.ownerId ? stage.getSave().actors[module.ownerId] : undefined;
                    if (owner && !owner.isOffSite(stage.getSave())) {
                        owner.locationId = module.id;
                    }
                    // Introduce a new faction:
                    if (!faction.active && faction?.reputation > 0) {
                        // Activate a new faction:
                        faction.active = true;
                        stage.setSkit({
                            type: SkitType.FACTION_INTRODUCTION,
                            moduleId: module.id,
                            script: [],
                            generating: true,
                            context: {factionId: faction.id,}
                        });
                    } else {
                        stage.setSkit({
                            type: SkitType.FACTION_INTERACTION,
                            moduleId: module.id,
                            script: [],
                            generating: true,
                            context: {factionId: faction.id}
                        });
                    }
                    setScreenType(ScreenType.SKIT);
                }
            } else if (Object.values(stage.getSave().actors).some(a => a.locationId === module.id)) {
                console.log("Opening skit.");
                stage.setSkit({
                    type: SkitType.RANDOM_ENCOUNTER,
                    moduleId: module.id,
                    script: [],
                    generating: true,
                    context: {}
                });
                setScreenType(ScreenType.SKIT);
            }
        },
        available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'scrying').length === 0;
        }
    },
    quarters: {
        name: 'Quarters',
        skitPrompt: 'Slave quarters are personal living spaces for Mansion inhabitants. Scenes here often involve personal interactions:  revelations, troubles, interests, or relaxation.',
        imagePrompt: 'A dank dungeon cell set in a medieval fantasy setting with a bed, personal storage, and ambient lighting, reflecting the occupant\'s personality.',
        baseImageUrl: 'https://media.charhub.io/85dec4c6-a3a9-4d1e-be5f-266bd9aa3171/27272f98-6ce9-467b-8aeb-e40eae5ead37.png', 
        defaultImageUrl: 'https://media.charhub.io/4dbd4725-a3cf-49c7-b8d3-06f27199b8f7/16a39e65-3528-44e8-a043-9a0559b24f49.png',
        cost: {Provision: 1},
        action: (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => {
            // Open the skit screen to speak to occupants
            const owner = module.ownerId ? stage.getSave().actors[module.ownerId] : undefined;
            if (owner && !owner.isOffSite(stage.getSave())) {
                console.log("Opening skit.");
                owner.locationId = module.id; // Ensure actor is in the module
                stage.setSkit({
                    type: SkitType.VISIT_CHARACTER,
                    actorId: module.ownerId,
                    moduleId: module.id,
                    script: [],
                    generating: true,
                    context: {}
                });
                setScreenType(ScreenType.SKIT);
            }
        },
        available: (stage: Stage) => {
            // Can have multiple quarters; no restriction
            return true;
        }
    },
    Feast hall: {
        name: 'Feast Hall',
        skitPrompt: 'The Feast Hall is a place for slaves and visitors to gather, relax, eat, and interact. Scenes here often involve camaraderie, conflicts, and leisure activities among the crew.',
        imagePrompt: 'A medieval feast hall with a large table and plentiful seating, at the head of the table sits a dark and imposing evil throne',
        role: 'Cook',
        roleDescription: `Maintain the Mansion's communal areas, ensuring they remain inviting and well-stocked for relaxation and socialization.`,
        baseImageUrl: 'https://media.charhub.io/a5a9f346-2d56-40af-b1fc-5e7666551352/077a49e1-8701-48b8-be9c-56edf8a438f5.png', 
        defaultImageUrl: 'https://media.charhub.io/a5a9f346-2d56-40af-b1fc-5e7666551352/077a49e1-8701-48b8-be9c-56edf8a438f5.png',
        cost: {Provision: 1},
        action: randomAction,
        available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'Feast Hall').length === 0;
        }
    },
 torture chamber: {
        name: 'Torture Chamber',
        skitPrompt: 'Screams echo through these cursed halls. The air smells of rust and copper. Here, uncooperative slaves learn the weight of their defiance.',
        imagePrompt: 'A dim stone dungeon with rusty iron restraints bolted to damp walls, scattered cruel implements catching torchlight, a central rack dominant in the shadows',
        role: 'Inquisitor',
        roleDescription: `Extract information and compliance through proven methods, maintaining the Mansion's standards of discipline.`,
        baseImageUrl: 'https://media.charhub.io/5355ec81-b064-4846-bef8-20469d840553/2bc7c139-c764-4dc4-86ed-ccfc77e4144e.png',
        defaultImageUrl: 'https://media.charhub.io/5355ec81-b064-4846-bef8-20469d840553/2bc7c139-c764-4dc4-86ed-ccfc77e4144e.png',
        cost: {Provision: 2},
        action: (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => {
            // Open the skit screen to speak to occupants
            const owner = module.ownerId ? stage.getSave().actors[module.ownerId] : undefined;
            if (owner && !owner.isOffSite(stage.getSave())) {
                console.log("Opening skit.");
                owner.locationId = module.id; // Ensure actor is in the module
                stage.setSkit({
                    type: SkitType.VISIT_CHARACTER,
                    actorId: module.ownerId,
                    moduleId: module.id,
                    script: [],
                    generating: true,
                    context: {}
                });
                setScreenType(ScreenType.SKIT);
                 },
        available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'Torture Chamber').length === 0;
        }
        
    },

brothel: {
name: 'Pleasure House',
skitPrompt: 'Incense hangs heavy in the air, mixing with sounds of whispered promises and velvet laughter. The Mansion\'s slaves entertain guests and their master, extracting coin through more... intimate means.',
imagePrompt: 'A lavish chamber draped in deep crimson silks and furs, plush cushions scattered across mosaic floors, ambient candlelight casting dancing shadows across oiled skin and knowing smiles',
role: 'Courtesan',
roleDescription: `Manage the Mansion's pleasure quarters, entertaining guests while gathering intelligence through pillow talk and attentive service.`,
baseImageUrl: 'https://media.charhub.io/52526331-005c-416f-9354-c325a14ee4af/92d1bfc9-15a5-44ff-84cf-fb4e6c6816f4.png',
defaultImageUrl: 'https://media.charhub.io/52526331-005c-416f-9354-c325a14ee4af/92d1bfc9-15a5-44ff-84cf-fb4e6c6816f4.png',
    cost: {Provision: 1},
        action: randomAction,
        available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'Feast Hall').length === 0;
        }
},
library: {
        name: 'Library',
        skitPrompt: 'Ancient tomes line endless shelves, their leather bindings creaking with age and trapped knowledge. The Mansion\'s library contains forbidden texts, slave training manuals, and arcane secrets waiting for worthy eyes.',
        imagePrompt: 'A vast circular library with spiraling shelves, reading nooks tucked into alcoves, floating candles illuminating faded text, a large central desk cluttered with open books and astronomical charts',
        role: 'Archivist',
        roleDescription: `Maintain and organize the Mansion's collection of knowledge, assisting slaves and master alike in research while carefully curating what information remains accessible.`,
        baseImageUrl: 'https://media.charhub.io/95d59a50-c962-4b4b-b724-4231854a0971/cca39056-1dc5-4448-8b20-719748f71798.png',
        defaultImageUrl: 'https://media.charhub.io/95d59a50-c962-4b4b-b724-4231854a0971/cca39056-1dc5-4448-8b20-719748f71798.png',
        cost: {Comfort: 2, Wealth: 1},
        action: randomAction,
       available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'library').length === 0;
        }
},
    Study: {
        name: 'The Master\'s Sanctum',
        skitPrompt: 'Few are permitted entry to this private retreat. Leather chairs face a crackling fireplace, maps of conquered territories adorn the walls, and a massive oak desk holds correspondence with powers both mortal and otherwise.',
        imagePrompt: 'A richly appointed private study with dark wood paneling, shelves of rare artifacts and skulls of vanquished foes, a grand fireplace casting warm light across a bearskin rug, imposing desk facing the entrance',
        role: 'Bodyslave',
        roleDescription: `Attend to every one of the Master's needs.`,
        baseImageUrl: 'https://media.charhub.io/336fb5cc-5cce-49a0-aac8-b1cfe3de715f/ffbeb633-4de8-48ce-9119-d13dd7fd00a3.png',
        defaultImageUrl: 'https://media.charhub.io/336fb5cc-5cce-49a0-aac8-b1cfe3de715f/ffbeb633-4de8-48ce-9119-d13dd7fd00a3.png',
        cost: {Magic: 1, Wealth: 1},
        action: randomAction,
       available: (stage: Stage) => {
            // Can have only one in stage.getSave().layout:
            return stage.getLayout().getModulesWhere(m => m.type === 'study').length === 0;
        }
  
/**
 * Register a custom faction module template at runtime
 */
export function registerFactionModule(faction: Faction,
    type: string,
    intrinsic: ModuleIntrinsic
): void {
    registerModule(type, intrinsic, randomAction, (stage: Stage) => {
        // Custom modules can only be built once and require minimum reputation with the faction
        const factionRep = stage.getSave().factions[faction.id]?.reputation || 0;
        const existingCount = stage.getLayout().getModulesWhere(m => m.type === type).length;
        return existingCount === 0 && factionRep >= 6;
    });
}

export function registerModule(type: string, intrinsic: ModuleIntrinsic, action?: (module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => void, available?: (stage: Stage) => boolean): void {
    MODULE_TEMPLATES[type] = {...intrinsic,
        action: action || intrinsic.action || randomAction,
        available: available || ((stage: Stage) => {return stage.getLayout().getModulesWhere(m => m.type === type).length === 0})
    };
}

/**
 * Check if a module type is registered (either built-in or custom)
 */
export function isModuleTypeRegistered(type: string): boolean {
    return type in MODULE_TEMPLATES;
}

/**
 * Get the template for a module type
 */
export function getModuleTemplate(type: string): ModuleIntrinsic | undefined {
    return MODULE_TEMPLATES[type];
}

export class Module<T extends ModuleType = ModuleType> {
    public id: string;
    public type: T;
    public ownerId?: string; // For quarters, this is the occupant, for other modules, it is the character assigned to the associated role
    public attributes?: Partial<ModuleIntrinsic> & { [key: string]: any };

    /**
     * Rehydrate a Module from saved data
     */
    static fromSave(savedModule: any): Module {
        let type = savedModule.type === 'medbay' ? 'infirmary' : savedModule.type; // Backwards compatibility
        type = type === 'communications' ? 'comms' : type; // Backwards compatibility
        return createModule(type as ModuleType, {
            id: savedModule.id,
            attributes: savedModule.attributes,
            ownerId: savedModule.ownerId
        });
    }

    constructor(type: T, opts?: { id?: string; attributes?: Partial<ModuleIntrinsic> & { [key: string]: any }; ownerId?: string }) {
        this.id = opts?.id ?? `${type}-${Date.now()}`;
        this.type = type;
        this.ownerId = opts?.ownerId;
        this.attributes = opts?.attributes || {};
    }

    /**
     * Get all attributes with intrinsic defaults applied
     */
    getAttributes(): ModuleIntrinsic & { [key: string]: any } {
        const defaults = MODULE_TEMPLATES[this.type] || {};
        return { ...defaults, ...(this.attributes || {}) };
    }

    /**
     * Get a specific attribute with intrinsic default fallback
     */
    getAttribute<K extends keyof ModuleIntrinsic>(key: K): ModuleIntrinsic[K];
    getAttribute(key: string): any;
    getAttribute(key: string): any {
        const instanceValue = this.attributes?.[key];
        if (instanceValue !== undefined) {
            return instanceValue;
        }
        return MODULE_TEMPLATES[this.type]?.[key];
    }

    /**
     * Get the action method for this module type
     */
    getAction(): ((module: Module, stage: Stage, setScreenType: (type: ScreenType) => void) => void) {
        return MODULE_TEMPLATES[this.type]?.action || randomAction;
    }
}

export function createModule(type: ModuleType, opts?: { id?: string; attributes?: Partial<ModuleIntrinsic> & { [key: string]: any }; ownerId?: string }): Module {
    return new Module(type, opts);
}

export const DEFAULT_GRID_SIZE = 6; // Deprecated - use DEFAULT_GRID_WIDTH and DEFAULT_GRID_HEIGHT
export const DEFAULT_GRID_WIDTH = 8;
export const DEFAULT_GRID_HEIGHT = 5;

export type LayoutChangeHandler = (grid: Module[]) => void;

export class Layout {
    public grid: (Module | null)[][];
    public gridWidth: number;
    public gridHeight: number;
    // Deprecated: gridSize kept for backward compatibility
    public get gridSize(): number {
        return Math.max(this.gridWidth, this.gridHeight);
    }

    constructor(width: number = DEFAULT_GRID_WIDTH, height: number = DEFAULT_GRID_HEIGHT, initial?: (Module | null)[][]) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.grid = initial || Array.from({ length: this.gridHeight }, () =>
            Array.from({ length: this.gridWidth }, () => null)
        );
    }

    /**
     * Rehydrate a Layout from saved data
     */
    static fromSave(savedLayout: any): Layout {
        const layout = Object.create(Layout.prototype);
        
        // Support both old square grids and new rectangular grids
        if (savedLayout.gridWidth !== undefined && savedLayout.gridHeight !== undefined) {
            layout.gridWidth = savedLayout.gridWidth;
            layout.gridHeight = savedLayout.gridHeight;
        } else {
            // Old save format - convert square grid to rectangular
            const oldSize = savedLayout.gridSize || DEFAULT_GRID_SIZE;
            layout.gridWidth = DEFAULT_GRID_WIDTH;
            layout.gridHeight = DEFAULT_GRID_HEIGHT;
        }
        
        // Rehydrate grid with proper Module instances
        const oldGrid = savedLayout.grid?.map((row: any[]) => 
            row?.map((savedModule: any) => 
                savedModule ? Module.fromSave(savedModule) : null
            )
        ) || [];
        
        // Create new grid with target dimensions
        layout.grid = Array.from({ length: layout.gridHeight }, () => 
            Array.from({ length: layout.gridWidth }, () => null)
        );
        
        // Copy modules from old grid, migrating out-of-bounds ones
        const modulesToRelocate: Module[] = [];
        
        for (let y = 0; y < oldGrid.length; y++) {
            for (let x = 0; x < (oldGrid[y]?.length || 0); x++) {
                const module = oldGrid[y][x];
                if (module) {
                    // Check if module fits in new grid
                    if (y < layout.gridHeight && x < layout.gridWidth) {
                        layout.grid[y][x] = module;
                    } else {
                        // Module is out of bounds, needs relocation
                        modulesToRelocate.push(module);
                    }
                }
            }
        }
        
        // Relocate out-of-bounds modules to first available empty spots
        for (const module of modulesToRelocate) {
            let relocated = false;
            for (let y = 0; y < layout.gridHeight && !relocated; y++) {
                for (let x = 0; x < layout.gridWidth && !relocated; x++) {
                    if (!layout.grid[y][x]) {
                        layout.grid[y][x] = module;
                        relocated = true;
                        console.log(`Migrated module ${module.type} from out-of-bounds to (${x}, ${y})`);
                    }
                }
            }
            if (!relocated) {
                console.warn(`Could not relocate module ${module.type} - grid is full`);
            }
        }
        
        return layout;
    }

    getLayout(): (Module | null)[][] {
        return this.grid;
    }

    setLayout(layout: (Module | null)[][]) {
        this.grid = layout;
    }

    getActorsAtModule(module: Module, save: SaveType): Actor[] {
        return Object.values(save.actors).filter(actor => actor.locationId === module.id);
    }

    getModulesWhere(predicate: (module: Module) => boolean): Module[] {
        const modules: Module[] = [];
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const module = this.grid[y][x];
                if (module && predicate(module)) {
                    modules.push(module);
                }
            }
        }
        return modules;
    }

    getModuleById(id: string): Module | null {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const module = this.grid[y][x];
                if (module && module.id === id) {
                    return module;
                }
            }
        }
        return null;
    }

    getModuleAt(x: number, y: number): Module | null {
        return this.grid[y]?.[x] ?? null;
    }

    getModuleCoordinates(module: Module | null): { x: number; y: number } {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (module && this.grid[y][x]?.id === module?.id) {
                    return { x, y };
                }
            }
        }
        return {x: -1000, y: -1000};
    }

    setModuleAt(x: number, y: number, module: Module) {
        console.log(`Setting module at (${x}, ${y}):`, module);
        if (!this.grid[y]) return;
        this.grid[y][x] = module;
        console.log(`Module set. Current module at (${x}, ${y}):`, this.grid[y][x]);
    }

    removeModule(module: Module | null): boolean {
        if (!module) return false;
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x]?.id === module.id) {
                    this.grid[y][x] = null;
                    console.log(`Removed module ${module.id} at (${x}, ${y})`);
                    return true;
                }
            }
        }
        return false;
    }

    removeModuleAt(x: number, y: number): Module | null {
        const module = this.grid[y]?.[x] || null;
        if (module && this.grid[y]) {
            this.grid[y][x] = null;
            console.log(`Removed module ${module.id} at (${x}, ${y})`);
        }
        return module;
    }
}

export async function generateModule(name: string, stage: Stage, additionalInformation?: string, role?: string): Promise<ModuleIntrinsic|null> {
    // Generate a module from a module name, some arbitrary details, and a role title
    const generatedResponse = await stage.generator.textGen({
        prompt: `{{messages}}This is preparatory request for structured and formatted game content. ` +
            `The goal is to define a module/room for a medieval fantasy slave training game, based primarily upon the name, and potentially some other information, ` +
            `while generally avoiding duplicating existing content below. ` +
            `\n\nExisting Modules:\n${Object.entries(MODULE_TEMPLATES).map(([type, mod]) => `- ${type}: Role - ${mod.role || 'N/A'}`).join('\n')}` +
            `\n\nNew Module Name: ${name}\n` +
            (role ? `New Role Name: ${role}\n` : '') +
            (additionalInformation ? `Additional Information: ${additionalInformation || 'N/A'}\n` : '') +
            `\nBackground: This game is a high fantasy multiverse setting that pulls characters from across eras and timelines and settings. ` +
            `The player of this game, ${stage.getSave().player.name}, manages a interdimensional boarding house called the Mansion, which captures and enslaves victims from alternate dimensions to build an evil slave empire. ` +
            `Modules are rooms and facilities that make up the Mansion; each module has a function varying between utility and entertainment or anything inbetween, and serve as a backdrop for various interactions and events. ` +
            `Every module offers a crew-assignable role with an associated responsibility or purpose, which can again vary wildly between practical and whimsical.\n\n` +
            `Instructions: After carefully considering the provided details, generate a formatted definition for a distinct and inspired station module that suits the prompt, outputting it in the following strict format:\n` +
            `MODULE NAME: The module's simple name (1-2 words)\n` +
            `PURPOSE: A brief summary of the module's function and role on the station, as well as how that role might affect the station's patients or inform skits at this location.\n` +
            `DESCRIPTION: A vivid visual description of the module's appearance, to be fed into image generation.\n` +
            `ROLE NAME: The simple title of the role associated with this module (1-2 words).\n` +
            `ROLE DESCRIPTION: A brief summary of the responsibilities and duties associated with this role.\n` +
            `COST: The resource cost to build this module, specified as 1-3 points of one or two station stats. Available stats are: Systems, Comfort, Provision, Security, Harmony, Wealth. Format as "StatName X, StatName Y" (e.g., "Wealth 2, Systems 1" or "Provision 2").\n` +
            `#END#\n\n` +
            `Example Response:\n` +
            `MODULE NAME: Armory\n` +
            `PURPOSE: A place for slaves to arm themselves with weapons in case of an attack on the mansion\n` +
            `DESCRIPTION: A medieval armory with racks of weapons and armor covering the walls.\n` +
            `ROLE NAME: Armorer\n` +
            `ROLE DESCRIPTION: Responsible for procuring new weapons and training slaves in combat\n` +
            `COST: Wealth 1, Magic 1\n` +
            `#END#\n\n` +
        stop: ['#END'],
        include_history: true,
        max_tokens: 400,
    });

    console.log('Generated module distillation:');
    console.log(generatedResponse);

    if (!generatedResponse?.result) {
        console.error('Failed to generate module');
        return null;
    }

    // Parse the generated response
    const text = generatedResponse.result;
    const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    
    let moduleName = '';
    let purpose = '';
    let description = '';
    let roleName = '';
    let roleDescription = '';
    let costString = '';

    for (const line of lines) {
        if (line.startsWith('MODULE NAME:')) {
            moduleName = line.substring('MODULE NAME:'.length).trim().toLowerCase();
        } else if (line.startsWith('PURPOSE:')) {
            purpose = line.substring('PURPOSE:'.length).trim();
        } else if (line.startsWith('DESCRIPTION:')) {
            description = line.substring('DESCRIPTION:'.length).trim();
        } else if (line.startsWith('ROLE NAME:')) {
            roleName = line.substring('ROLE NAME:'.length).trim();
        } else if (line.startsWith('ROLE DESCRIPTION:')) {
            roleDescription = line.substring('ROLE DESCRIPTION:'.length).trim();
        } else if (line.startsWith('COST:')) {
            costString = line.substring('COST:'.length).trim();
        }
    }

    // Validation
    if (!moduleName || !purpose || !description || !roleName || !roleDescription) {
        console.error('Failed to parse required fields from generated module', {
            moduleName, purpose, description, roleName, roleDescription
        });
        return null;
    }
    
    if (moduleName.length < 2 || moduleName.length > 30) {
        console.error('Module name has invalid length:', moduleName);
        return null;
    }

    // Parse cost with default fallback
    const parsedCost: {[key in StationStat]?: number} = {};
    
    if (costString) {
        // Parse cost string like "Wealth 2, Systems 1" or "Provision 2"
        const costParts = costString.split(',').map(s => s.trim());
        
        for (const part of costParts) {
            // Match pattern: "StatName Number"
            const match = part.match(/^([a-zA-Z]+)\s+(\d+)$/);
            if (match) {
                const statName = match[1];
                const amount = parseInt(match[2]);
                
                // Find matching StationStat (case-insensitive)
                for (const stat of Object.values(StationStat)) {
                    if (stat.toLowerCase() === statName.toLowerCase()) {
                        // Clamp to 1-3 as specified
                        parsedCost[stat] = Math.max(1, Math.min(3, amount));
                        break;
                    }
                }
            }
        }
    }
    
    // Apply default cost if parsing failed or resulted in no costs
    const finalCost = Object.keys(parsedCost).length > 0 
        ? parsedCost 
        : { [StationStat.WEALTH]: 2, [StationStat.SYSTEMS]: 1 }; // Default: 2 Wealth, 1 Systems

    const module: ModuleIntrinsic = {
        name: moduleName,
        skitPrompt: purpose,
        imagePrompt: description,
        role: roleName,
        roleDescription: roleDescription,
        baseImageUrl: '',
        defaultImageUrl: '',
        cost: finalCost,
    };

    await generateModuleImage(module, stage);

    if (!module.baseImageUrl || !module.defaultImageUrl) {
        console.error('Failed to generate images for module');
        return null;
    }

    return module;
}

export async function generateModuleImage(module: ModuleIntrinsic, stage: Stage): Promise<void> {
    // Start with a base image:
    const baseImageUrl = await stage.makeImage({
        prompt: `The detailed interior of an unoccupied medieval fantasy manor module/room. The design should reflect the following description: ${module.imagePrompt}. ` +
            `Regardless of aesthetic, the image is rendered in a vibrant, painterly style with thick smudgy lines.`,
        aspect_ratio: AspectRatio.SQUARE
    }, '');
    if (!baseImageUrl) {
        return;
    }
    // Next, create a default variant with Qwen's image-to-image:
    const defaultImageUrl = await stage.makeImageFromImage({
        image: baseImageUrl,
        prompt: `Apply a visual novel art style to this medieval fantasy room (${module.imagePrompt}). Remove any characters from the scene.`,
        transfer_type: 'edit'
    }, '');
    if (baseImageUrl && defaultImageUrl) {
        module.baseImageUrl = baseImageUrl;
        module.defaultImageUrl = defaultImageUrl;
    }
}
