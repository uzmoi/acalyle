export interface Theme {
  app: AppTheme;
  bookOverview: BookOverviewTheme;
  note: NoteTheme;
  tag: TagTheme;
}

export interface AppTheme {
  text: string;
  bg: string;
}

export interface BookOverviewTheme {
  text: string;
  bg: string;
  border: string;
  round: string;
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
