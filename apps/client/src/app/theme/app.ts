export interface AppTheme {
  text: string;
  bg: string;
}

export interface BookCoverTheme {
  text: string;
  bg: string;
  border: string;
  round: string;
}

export interface NoteTheme {
  text: string;
  bg: string;
  outline: string;
}

export interface TagTheme {
  text: string;
  bg: string;
  outline: string;
}

declare module "@acalyle/ui" {
  interface Theme {
    app: AppTheme;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    book_cover: BookCoverTheme;
    note: NoteTheme;
    tag: TagTheme;
  }
}
