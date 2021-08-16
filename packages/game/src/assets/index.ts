import { ImageManager } from "@js-mmo/renderer";

import NameplateBgGreen from "./nameplate-big-green.png";
import NameplateBgRed from "./nameplate-big-red.png";
import NameplateBorderGreen from "./nameplate-border-big-green.png";
import NameplateBorderRed from "./nameplate-border-big-red.png";
import SpellIconBg from "./spellicon-bg.png";
import SpellIconFireball from "./spellicon-fireball.png";
import SpellIconRefresh from "./spellicon-refresh.png";
import SpellIconRot from "./spellicon-rot.png";

void ImageManager.preload([
  NameplateBgGreen,
  NameplateBgRed,
  NameplateBorderGreen,
  NameplateBorderRed,
  SpellIconBg,
  SpellIconFireball,
  SpellIconRefresh,
  SpellIconRot,
]);

export const TILESET_PATH = "./assets/dev_env_sheet.json";
