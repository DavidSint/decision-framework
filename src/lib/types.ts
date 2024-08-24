export interface Dimension {
	name: string;
	importance: number;
}

export interface NewDimension {
	name: string;
	importance?: number;
}

export interface Option {
	name: string;
	ratings: number[];
}

export interface Result {
	optionName: string;
	score: number;
}
