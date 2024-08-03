import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  declare type QueryKey = any[] | readonly any[];
}
