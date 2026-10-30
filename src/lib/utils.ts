import { createCn } from "cn/config"

// Sem isto, o cn confunde text-body-sm com uma cor e apaga uma das duas classes.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [(valor: string) => /^(display|heading|body|label)-/.test(valor)] }],
    },
  },
})
