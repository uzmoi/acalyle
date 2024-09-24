export interface Theme {
    note: NoteTheme;
    tag: TagTheme;
}

export interface NoteTheme {
    text: string;
    bg: string;
}

export interface TagTheme {
    text: string;
    bg: string;
    outline: string;
}
