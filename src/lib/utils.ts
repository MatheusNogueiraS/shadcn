import { createCn, validators } from "cn/config"

const espessura = [validators.isTshirtSize]
const lados = ["", "-x", "-y", "-s", "-e", "-t", "-r", "-b", "-l"]

// Sem isto, o cn confunde text-body-sm e border-sm com uma cor e apaga uma das duas classes.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [(valor: string) => /^(display|heading|body|label|mono)-/.test(valor)] }],
      ...Object.fromEntries(lados.map((lado) => [`border-w${lado}`, [{ [`border${lado}`]: espessura }]])),
      "ring-w": [{ ring: espessura }],
      "outline-w": [{ outline: espessura }],
    },
  },
})
