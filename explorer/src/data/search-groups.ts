import { Column, Spreadsheet } from 'sheethuahua';
import { asStrings, once, SPREADSHEET_ID } from './shared';

export type SearchGroup = string[];

export const loadSearchGroups = once(() =>
  Spreadsheet(SPREADSHEET_ID).get(
    'search group',
    Column('keyword', asStrings().optional([]))
  )
);
