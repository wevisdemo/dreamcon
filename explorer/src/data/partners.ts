import {
  asString,
  Column,
  Object,
  Spreadsheet,
  type StaticDecode,
} from 'sheethuahua';
import { once } from './shared';

const SPREADSHEET_ID = '1I5zayl6xMft3eJZlmdh06LA9IGKqqJNMHFRB3JxPHkE';

export const partnerSchema = Object({
  name: Column('name', asString()),
});

export type Partner = StaticDecode<typeof partnerSchema>;

export const loadPartners = once(() =>
  Spreadsheet(SPREADSHEET_ID).get('event partner list', partnerSchema)
);
