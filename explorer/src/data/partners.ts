import {
  asString,
  Column,
  Object,
  Spreadsheet,
  type StaticDecode,
} from 'sheethuahua';
import { once, SPREADSHEET_ID } from './shared';

export const partnerSchema = Object({
  name: Column('name', asString()),
});

export type Partner = StaticDecode<typeof partnerSchema>;

export const loadPartners = once(() =>
  Spreadsheet(SPREADSHEET_ID).get('event partner list', partnerSchema)
);
