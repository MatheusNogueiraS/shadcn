import { toast } from "@/components/ui/toast"

// A área de transferência falha fora de HTTPS ou sem permissão: o aviso precisa refletir o que aconteceu.
export const copiar = (texto: string, titulo: string) =>
  Promise.resolve()
    .then(() => navigator.clipboard.writeText(texto))
    .then(
      () => toast.add({ title: titulo }),
      () => toast.add({ type: "error", title: "Não foi possível copiar" })
    )
