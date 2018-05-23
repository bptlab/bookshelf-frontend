export interface Dataobject {
    id: string;
    dataclass: string;
    state: string;
    locked: boolean;
    attributeConfiguration: Attribute[];
}

export interface Attribute {
    id: string;
    name: string;
    type: string;
    value: any;
}
