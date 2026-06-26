import { chrome } from './chrome'
import { bootstrap } from './component'
import { grittyLowFantasy } from './gritty-low-fantasy'
import { highMagicAcademy } from './high-magic-academy'
import { mint } from './mint'
import { record } from './record'
import { synthesis } from './synthesis'
import { weaver } from './weaver'

export const engine = {
  bootstrap: bootstrap,
  components: {
    mint: mint,
    record: record,
    synthesis: synthesis,
    chrome: chrome,
    weaver: weaver,
    grittyLowFantasy: grittyLowFantasy,
    highMagicAcademy: highMagicAcademy
  }
}
