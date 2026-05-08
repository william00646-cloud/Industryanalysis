import { oilGas } from './oilGas';
import { semiconductor } from './semiconductor';
import { healthcare } from './healthcare';
import { fmcg } from './fmcg';
import { automotive } from './automotive';
import { pc } from './pc';
import { mobile } from './mobile';
import type { IndustryData } from '../../types/industry';

export const allIndustries: IndustryData[] = [
  oilGas,
  semiconductor,
  healthcare,
  fmcg,
  automotive,
  pc,
  mobile,
];

export const defaultIndustryId = 'oil-gas';
