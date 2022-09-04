export interface IProposal {
    id: number;
    distance: number;
    livingAreaVolume: number;
    atticAreaVolume: number;
    movingObjectType: MovingObjectType | undefined;
    movingObjectTypeName: string;
    calculatedPrice: number;
}

export enum MovingObjectType {
    Piano = 1
}