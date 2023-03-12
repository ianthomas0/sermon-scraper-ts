import { ScriptureReference } from '.';

export interface Sermon {
    url: string;
    author: string;
    source: string;
    date: string;
    title: string;
    scripture: string;
    scriptureReferences?: ScriptureReference[];
    topics?: string[];
}
