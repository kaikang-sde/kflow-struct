import { TComponentTypes } from "../..";


/**
 * IPage is a type that represents a page in the database
 */
export interface IPage {
    id: number;
    account_id: number;
    page_name: string;
    components: string[];
    tdk: string;
    desc: string;
}

/**
 * IComponent is a type that represents a component in the database
 */
export interface IComponent {
    id: number;
    account_id: number;
    page_id: number;
    type: TComponentTypes;
    options: Record<string, any>;
}

/**
 * IComponentData is a type that represents the data of a component in the database
 */
export interface IComponentData {
    id: number;
    user: string;
    page_id: number;
    props: Record<string, any>;
}
