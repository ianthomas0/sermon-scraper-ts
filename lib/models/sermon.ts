import { ScriptureReference } from ".";

export interface Sermon {
  url: string;
  author: string;
  source: string;
  date: Date;
  title: string;
  scripture: string;
  scriptureReferences: ScriptureReference[];
}