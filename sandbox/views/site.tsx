import { cn } from "cn"
import { CreditCardIcon, LandmarkIcon, PiggyBankIcon, ShieldCheckIcon, SmartphoneIcon, TrendingUpIcon, type LucideIcon } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { badgeVariants } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from "@/components/ui/tabs"
import { banner } from "../art"

const products: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Conta corrente", text: "Pix e transferências sem tarifa.", icon: LandmarkIcon },
  { title: "Cartões", text: "Crédito com limite ajustável no app.", icon: CreditCardIcon },
  { title: "Poupança", text: "Guarde um pouco todo mês.", icon: PiggyBankIcon },
  { title: "Investimentos", text: "Renda fixa a partir de R$ 100.", icon: TrendingUpIcon },
]
const slides = [
  { label: "Cartão sem anuidade", from: "#fa6300", to: "#a43f04" },
  { label: "Conta para sua empresa", from: "#462a71", to: "#2d194b" },
  { label: "Empréstimo no app", from: "#674c96", to: "#fa6300" },
]
const plans = [
  { name: "Essencial", price: "Grátis", text: "Para o dia a dia." },
  { name: "Plus", price: "R$ 19/mês", text: "Com cashback no cartão." },
  { name: "Premium", price: "R$ 49/mês", text: "Com sala VIP e gerente." },
]

export function SiteView() {
  return (
    <div className="space-y-10">
      <SiteNav />
      <Hero />
      <PlansTabs />
      <Faq />
    </div>
  )
}

function SiteNav() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border p-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
            {/* A doc do shadcn mostra o indicador fora dos itens, mas o Base UI quebra a página se ele não estiver dentro de um. */}
            <NavigationMenuIndicator className="absolute inset-x-0 opacity-0 data-popup-open:opacity-100" />
            <NavigationMenuContent>
              <ul className="grid w-[min(32rem,calc(100vw-3rem))] gap-1 sm:grid-cols-2">
                {products.map((p) => (
                  <li key={p.title}>
                    <NavigationMenuLink href="#institucional" className="items-start">
                      <p.icon className="mt-0.5 shrink-0" />
                      <span>
                        <span className="block font-medium">{p.title}</span>
                        <span className="block text-muted-foreground">{p.text}</span>
                      </span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Segurança</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-64 gap-1">
                <li><NavigationMenuLink href="#institucional"><ShieldCheckIcon /> Proteção de conta</NavigationMenuLink></li>
                <li><NavigationMenuLink href="#institucional"><SmartphoneIcon /> Celular perdido</NavigationMenuLink></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#institucional" className={navigationMenuTriggerStyle()}>Ajuda</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* buttonVariants e badgeVariants aplicam o visual em um link comum; sem cn() as classes de borda entram em conflito. */}
      <div className="flex items-center gap-2">
        <a href="#institucional" className={cn(badgeVariants({ variant: "outline" }))}>Novidades</a>
        <a href="#pagamentos" className={cn(buttonVariants({ size: "sm" }))}>Abrir conta</a>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <Carousel opts={{ loop: true }} className="mx-12">
      <CarouselContent>
        {slides.map((s) => (
          <CarouselItem key={s.label}>
            <AspectRatio ratio={21 / 9} className="overflow-hidden rounded-3xl bg-muted">
              <img src={banner(s.from, s.to, s.label)} alt={s.label} className="size-full object-cover" />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label="Anterior" />
      <CarouselNext aria-label="Próximo" />
    </Carousel>
  )
}

function PlansTabs() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Escolha o seu plano</h2>
      <Tabs defaultValue="pf">
        <TabsList variant="line">
          <TabsTrigger value="pf">Para você</TabsTrigger>
          <TabsTrigger value="pj">Para empresas</TabsTrigger>
        </TabsList>
        {["pf", "pj"].map((tab) => (
          <TabsContent key={tab} value={tab} className="pt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((p) => (
                <Card key={p.name}>
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                    <CardDescription>{p.text}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-2xl font-semibold tabular-nums">{p.price}</CardContent>
                  <CardFooter><Button variant={p.name === "Plus" ? "default" : "outline"} className="w-full">Escolher</Button></CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {/* tabsListVariants aplica o visual da lista de abas em um filtro feito de links. */}
      <nav aria-label="Atalhos de plano" className={cn(tabsListVariants())}>
        <a href="#institucional" className="rounded-full px-3 py-1 text-sm">Comparar</a>
        <a href="#institucional" className="rounded-full px-3 py-1 text-sm">Tarifas</a>
      </nav>
    </section>
  )
}

function Faq() {
  return (
    <section className="space-y-4">
      <Separator />
      <h2 className="text-2xl font-semibold tracking-tight">Perguntas frequentes</h2>
      <Accordion>
        <AccordionItem value="a"><AccordionTrigger>Como abro minha conta?</AccordionTrigger><AccordionContent>Pelo app, em poucos minutos, com um documento e uma foto.</AccordionContent></AccordionItem>
        <AccordionItem value="b"><AccordionTrigger>Tem tarifa de manutenção?</AccordionTrigger><AccordionContent>Não no plano Essencial.</AccordionContent></AccordionItem>
        <AccordionItem value="c"><AccordionTrigger>Como falo com o atendimento?</AccordionTrigger><AccordionContent>Pelo chat do app, a qualquer hora.</AccordionContent></AccordionItem>
      </Accordion>
    </section>
  )
}
