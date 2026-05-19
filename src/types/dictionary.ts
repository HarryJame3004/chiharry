export interface DictDefinition {
  definition: string;
  example?: string;
}

export interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}

export interface DictWordData {
  word: string;
  meanings: DictMeaning[];
}