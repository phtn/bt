// 'use client'

// import {AnimatePresence, MotionConfig, Transition, motion} from 'motion/react'
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useId,
//   useRef,
//   useState,
// } from 'react'
// import {createPortal} from 'react-dom'

// import {Icon} from '@/lib/icons'
// import {cn} from '@/lib/utils'
// import {Slot} from '@radix-ui/react-slot'

// const TRANSITION: Transition = {
//   type: 'spring',
//   bounce: 0.05,
//   visualDuration: 0.3,
// }

// function useClickOutside(
//   ref: React.RefObject<HTMLElement | null>,
//   handler: () => void,
// ) {
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (ref.current && !ref.current.contains(event.target as Node)) {
//         handler()
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [ref, handler])
// }

// interface CPopoverContextType {
//   isOpen: boolean
//   openCPopover: () => void
//   closeCPopover: () => void
//   uniqueId: string
//   note: string
//   setNote: (note: string) => void
// }

// const CPopoverContext = createContext<CPopoverContextType | undefined>(
//   undefined,
// )

// function useCPopover() {
//   const context = useContext(CPopoverContext)
//   if (!context) {
//     throw new Error('useCPopover must be used within a CPopoverProvider')
//   }
//   return context
// }

// function useCPopoverLogic() {
//   const uniqueId = useId()
//   const [isOpen, setIsOpen] = useState(false)
//   const [note, setNote] = useState('')

//   const openCPopover = () => setIsOpen(true)
//   const closeCPopover = () => {
//     setIsOpen(false)
//     setNote('')
//   }

//   return {isOpen, openCPopover, closeCPopover, uniqueId, note, setNote}
// }

// interface CPopoverRootProps {
//   children: React.ReactNode
//   className?: string
// }

// export function CPopoverRoot({children, className}: CPopoverRootProps) {
//   const popoverLogic = useCPopoverLogic()

//   return (
//     <CPopoverContext.Provider value={popoverLogic}>
//       <MotionConfig transition={TRANSITION}>
//         <div
//           className={cn(
//             'relative flex items-center justify-center isolate',
//             className,
//           )}>
//           {children}
//         </div>
//       </MotionConfig>
//     </CPopoverContext.Provider>
//   )
// }

// interface CPopoverTriggerProps {
//   children: React.ReactNode
//   className?: string
//   asChild?: boolean
// }

// export function CPopoverTrigger({
//   children,
//   className,
//   asChild,
// }: CPopoverTriggerProps) {
//   const {openCPopover, uniqueId, isOpen} = useCPopover()

//   return asChild ? (
//     <Slot />
//   ) : (
//     <motion.button
//       key='button'
//       layoutId={`popover-${uniqueId}`}
//       className={cn(
//         'flex rounded-xl h-9 items-center border border-zinc-950/10 bg-white px-3 text-zinc-950 dark:border-zinc-50/10 dark:bg-zinc-700 dark:text-zinc-50',
//         // Prevent trigger from intercepting clicks when popover is open
//         isOpen ? 'pointer-events-none' : '',
//         className,
//       )}
//       aria-expanded={isOpen}
//       aria-controls={`popover-panel-${uniqueId}`}
//       onClick={openCPopover}>
//       <motion.span layoutId={`popover-label-${uniqueId}`} className='text-sm'>
//         {children}
//       </motion.span>
//     </motion.button>
//   )
// }

// interface CPopoverContentProps {
//   children: React.ReactNode
//   className?: string
//   align?: 'start' | 'end'
// }

// export function CPopoverContent({children, className}: CPopoverContentProps) {
//   const {isOpen, closeCPopover, uniqueId} = useCPopover()
//   const formContainerRef = useRef<HTMLDivElement>(null)

//   useClickOutside(formContainerRef, closeCPopover)

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         closeCPopover()
//       }
//     }

//     document.addEventListener('keydown', handleKeyDown)

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown)
//     }
//   }, [closeCPopover])

//   return (
//     document &&
//     createPortal(
//       <AnimatePresence>
//         {isOpen && (
//           <div className='fixed inset-0 z-[1000]'>
//             <div
//               className='absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-auto'
//               onMouseDown={(e) => {
//                 e.stopPropagation()
//                 closeCPopover()
//               }}
//               onClick={(e) => e.stopPropagation()}
//               aria-hidden='true'
//             />
//             <motion.div
//               ref={formContainerRef}
//               layoutId={`popover-${uniqueId}`}
//               id={`popover-panel-${uniqueId}`}
//               role='dialog'
//               aria-modal='true'
//               onMouseDown={(e) => e.stopPropagation()}
//               onClick={(e) => e.stopPropagation()}
//               className={cn(
//                 'absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2',
//                 'h-[200px] w-[364px] overflow-hidden border border-zinc-950/10',
//                 // Use opaque backgrounds to avoid see-through content
//                 'bg-white outline-none dark:bg-zinc-700',
//                 'shadow-lg rounded-xl pointer-events-auto',
//                 className,
//               )}
//               style={{
//                 borderRadius: 12,
//               }}>
//               {children}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>,
//       document.body,
//     )
//   )
// }

// interface CPopoverFormProps {
//   children: React.ReactNode
//   onSubmit?: (note: string) => void
//   className?: string
// }

// export function CPopoverForm({
//   children,
//   onSubmit,
//   className,
// }: CPopoverFormProps) {
//   const {note, closeCPopover} = useCPopover()

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSubmit?.(note)
//     closeCPopover()
//   }

//   return (
//     <form
//       className={cn('flex h-full flex-col', className)}
//       onSubmit={handleSubmit}>
//       {children}
//     </form>
//   )
// }

// interface CPopoverLabelProps {
//   children: React.ReactNode
//   className?: string
// }

// export function CPopoverLabel({children, className}: CPopoverLabelProps) {
//   const {uniqueId, note} = useCPopover()

//   return (
//     <motion.span
//       layoutId={`popover-label-${uniqueId}`}
//       aria-hidden='true'
//       style={{
//         opacity: note ? 0 : 1,
//       }}
//       className={cn(
//         'absolute left-4 top-3 select-none text-sm text-zinc-500 dark:text-zinc-400',
//         className,
//       )}>
//       {children}
//     </motion.span>
//   )
// }

// interface CPopoverTextareaProps {
//   className?: string
// }

// export function CPopoverTextarea({className}: CPopoverTextareaProps) {
//   const {note, setNote} = useCPopover()

//   return (
//     <textarea
//       className={cn(
//         'h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none',
//         className,
//       )}
//       autoFocus
//       value={note}
//       onChange={(e) => setNote(e.target.value)}
//     />
//   )
// }

// interface CPopoverFooterProps {
//   children: React.ReactNode
//   className?: string
// }

// export function CPopoverFooter({children, className}: CPopoverFooterProps) {
//   return (
//     <div
//       key='close'
//       className={cn('flex justify-between px-4 py-3', className)}>
//       {children}
//     </div>
//   )
// }

// interface CPopoverCloseButtonProps {
//   className?: string
// }

// export function CPopoverCloseButton({className}: CPopoverCloseButtonProps) {
//   const {closeCPopover} = useCPopover()

//   return (
//     <button
//       type='button'
//       className={cn('flex items-center', className)}
//       onClick={closeCPopover}
//       aria-label='Close popover'>
//       <Icon name='add' className='rotate-45 text-zinc-900 dark:text-zinc-100' />
//     </button>
//   )
// }

// interface CPopoverSubmitButtonProps {
//   className?: string
// }

// export function CPopoverSubmitButton({className}: CPopoverSubmitButtonProps) {
//   return (
//     <button
//       className={cn(
//         'relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800',
//         className,
//       )}
//       type='submit'
//       aria-label='Submit note'>
//       Submit
//     </button>
//   )
// }

// export function CPopoverHeader({
//   children,
//   className,
// }: {
//   children: React.ReactNode
//   className?: string
// }) {
//   return (
//     <div
//       className={cn(
//         'px-4 py-2 font-semibold text-zinc-900 dark:text-zinc-100',
//         className,
//       )}>
//       {children}
//     </div>
//   )
// }

// export function CPopoverBody({
//   children,
//   className,
// }: {
//   children: React.ReactNode
//   className?: string
// }) {
//   return <div className={cn('p-4', className)}>{children}</div>
// }

// // New component: CPopoverButton
// export function CPopoverButton({
//   children,
//   onClick,
//   className,
// }: {
//   children: React.ReactNode
//   onClick?: VoidFunction
//   className?: string
// }) {
//   return (
//     <button
//       type='button'
//       className={cn(
//         'flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700',
//         className,
//       )}
//       onClick={onClick}>
//       {children}
//     </button>
//   )
// }

// export const cmc = {
//   title:
//     'Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap',
//   metaDescription:
//     'Top cryptocurrency prices and charts, listed by market capitalization. Free access to current and historic data for Bitcoin and thousands of altcoins.',
//   content:
//     "CryptocurrenciesCryptocurrenciesRankingCategoriesHistorical SnapshotsToken unlocksYieldReal-World AssetsLeaderboardsTrendingUpcomingRecently AddedGainers & LosersMost VisitedCommunity SentimentChain RankingMarket OverviewMarket OverviewCoinMarketCap 20 IndexCoinMarketCap 100 IndexFear and Greed IndexAltcoin Season IndexBitcoin DominanceCrypto ETFsMarket Cycle IndicatorsRelative Strength Index (RSI)TreasuriesBitcoin TreasuriesNFTOverall NFT StatsUpcoming SalesDexScanSignalsNewTrendingNewGainersMeme ExplorerCommunity VotesTop TradersExchangesCentralized ExchangesSpotDerivativesDecentralized ExchangesSpotDerivativesCommunityFeedsTopicsLivesArticlesSentimentProductsProductsConverterNewsletterCMC LabsTelegram BotAdvertiseCrypto APISite WidgetsCampaignsAirdropsDiamond RewardsLearn & EarnCalendarsICO CalendarEvents CalendarLearnNewsAcademyResearchVideosGlossary TopTopTrendingTrendingMost VisitedMost VisitedNewNewGainersGainersReal-World AssetsReal-World AssetsMore More FiltersColumns#NamePrice1h %24h %7d %Market CapVolume(24h)Circulating SupplyLast 7 Days1BitcoinBTC$112,430.600.23%1.56%0.18%$2.24T$2,239,532,948,891$63,629,125,722565.83K19.91M BTC2EthereumETH$4,481.800.18%4.12%3.10%$540.37B$540,373,246,266$37,965,411,1218.48M120.7M ETH3XRPXRP$2.860.12%2.71%4.89%$170.53B$170,527,157,971$5,428,984,0341.89B59.48B XRP4TetherUSDT$1.000.00%0.02%0.01%$168.17B$168,170,159,567$112,435,362,705112.41B168.14B USDT5BNBBNB$861.690.13%1.54%0.12%$119.98B$119,981,195,772$1,912,912,6232.21M139.18M BNB6SolanaSOL$210.950.03%4.17%1.26%$114.13B$114,134,590,698$8,350,371,85239.58M541.03M SOL7USDCUSDC$0.99990.01%0.02%0.01%$72.16B$72,161,152,920$13,914,861,26713.91B72.16B USDC8DogecoinDOGE$0.21880.13%3.16%0.78%$33B$33,004,502,524$1,766,579,2798.07B150.78B DOGE9TRONTRX$0.34180.23%1.41%2.30%$32.36B$32,356,276,857$801,375,9982.34B94.66B TRX10CardanoADA$0.83970.14%3.02%3.03%$30.01B$30,013,983,267$1,007,078,9421.19B35.74B ADAChainlinkLINK$23.80HyperliquidHYPE$46.42Ethena USDeUSDe$1.00SuiSUI$3.38Bitcoin CashBCH$594.71StellarXLM$0.37AvalancheAVAX$25.47HederaHBAR$0.22CronosCRO$0.28UNUS SED LEOLEO$9.50LitecoinLTC$112.90ToncoinTON$3.18Shiba InuSHIB$0.00PolkadotDOT$3.88UniswapUNI$9.71Bitget TokenBGB$5.01World Liberty FinancialWLFI$0.22DaiDAI$1.00MoneroXMR$270.96AaveAAVE$327.71EthenaENA$0.72PepePEPE$0.00OKBOKB$180.38MantleMNT$1.12Ethereum ClassicETC$21.01BittensorTAO$327.12NEAR ProtocolNEAR$2.48OndoONDO$0.97AptosAPT$4.38POL (prev. MATIC)POL$0.28PiPI$0.35ArbitrumARB$0.51World Liberty Financial USDUSD1$1.00Internet ComputerICP$4.88StoryIP$8.37KaspaKAS$0.08CosmosATOM$4.54GateTokenGT$16.94VeChainVET$0.02AlgorandALGO$0.23Pudgy PenguinsPENGU$0.03KuCoin TokenKCS$15.10RenderRENDER$3.51WorldcoinWLD$0.90SeiSEI$0.29OFFICIAL TRUMPTRUMP$8.43SkySKY$0.07BonkBONK$0.00FilecoinFIL$2.33JupiterJUP$0.50FlareFLR$0.02Artificial Superintelligence AllianceFET$0.62First Digital USDFDUSD$1.00XDC NetworkXDC$0.08Pump.funPUMP$0.00FourFORM$3.58InjectiveINJ$13.37OptimismOP$0.72CelestiaTIA$1.64QuantQNT$101.58PayPal USDPYUSD$1.00StacksSTX$0.64Lido DAOLDO$1.24SPX6900SPX$1.18Curve DAO TokenCRV$0.79Aerodrome FinanceAERO$1.19MemeCoreM$0.99PAX GoldPAXG$3585.06ImmutableIMX$0.53The GraphGRT$0.09RaydiumRAY$3.46Pyth NetworkPYTH$0.16KaiaKAIA$0.15ConfluxCFX$0.18SonicS$0.31FLOKIFLOKI$0.00Tether GoldXAUt$3574.73Ethereum Name ServiceENS$23.04PancakeSwapCAKE$2.42NexoNEXO$1.27dogwifhatWIF$0.82PendlePENDLE$4.79FartcoinFARTCOIN$0.81Theta NetworkTHETA$0.80TezosXTZ$0.73VaultaA$0.49IOTAIOTA$0.19GalaGALA$0.02Virtuals ProtocolVIRTUAL$1.14The SandboxSAND$0.281234...96Showing 1 - 100 out of 9551123456...96Today's Cryptocurrency Prices by Market CapThe global crypto market cap is $3.88T, a 2.08% increase over the last day.The total crypto market volume over the last 24 hours is $158.31B, which makes a 12.25% decrease. The total volume in DeFi is currently $37.43B, 23.64% of the total crypto market 24-hour volume. The volume of all stable coins is now $153.87B, which is 97.20% of the total crypto market 24-hour volume.Bitcoin’s dominance is currently 57.68%, a decrease of 0.30% over the day.Read MoreFind out how we work by clicking here. Read MoreToday’s Cryptocurrency Prices, Charts and Data Welcome to CoinMarketCap.com! This site was founded in May 2013 by Brandon Chez to provide up-to-date cryptocurrency prices, charts and data about the emerging cryptocurrency markets. Since then, the world of blockchain and cryptocurrency has grown exponentially and we are very proud to have grown with it. We take our data very seriously and we do not change our data to fit any narrative: we stand for accurately, timely and unbiased information. All Your Crypto Market Data Needs in One Place Here at CoinMarketCap, we work very hard to ensure that all the relevant and up-to-date information about cryptocurrencies, coins and tokens can be located in one easily discoverable place. From the very first day, the goal was for the site to be the number one location online for crypto market data, and we work hard to empower our use",
//   links: [
//     'https://coinmarketcap.com/',
//     'https://coinmarketcap.com/cryptocurrency-category/',
//     'https://coinmarketcap.com/historical/',
//     'https://coinmarketcap.com/token-unlocks/',
//     'https://coinmarketcap.com/yield/',
//     'https://coinmarketcap.com/real-world-assets/',
//     'https://coinmarketcap.com/trending-cryptocurrencies/',
//     'https://coinmarketcap.com/upcoming/',
//     'https://coinmarketcap.com/new/',
//     'https://coinmarketcap.com/gainers-losers/',
//     'https://coinmarketcap.com/most-viewed-pages/',
//     'https://coinmarketcap.com/sentiment/',
//     'https://coinmarketcap.com/chain-ranking/',
//     'https://coinmarketcap.com/charts/',
//     'https://coinmarketcap.com/charts/cmc20/',
//     'https://coinmarketcap.com/charts/cmc100/',
//     'https://coinmarketcap.com/charts/fear-and-greed-index/',
//     'https://coinmarketcap.com/charts/altcoin-season-index/',
//     'https://coinmarketcap.com/charts/bitcoin-dominance/',
//     'https://coinmarketcap.com/etf/',
//   ],
//   images: [
//     'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
//     'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1.svg',
//     'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
//     'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1027.svg',
//     'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
//     'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/52.svg',
//     'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
//     'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/825.svg',
//     'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
//     'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1839.svg',
//   ],
// }

// export const httpbin = {
//   title: '',
//   metaDescription: '',
//   content:
//     "Herman Melville - Moby-Dick Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered old blacksmith, had not removed his portable forge to the hold again, after concluding his contributory work for Ahab's leg, but still retained it on deck, fast lashed to ringbolts by the foremast; being now almost incessantly invoked by the headsmen, and harpooneers, and bowsmen to do some little job for them; altering, or repairing, or new shaping their various weapons and boat furniture. Often he would be surrounded by an eager circle, all waiting to be served; holding boat-spades, pike-heads, harpoons, and lances, and jealously watching his every sooty movement, as he toiled. Nevertheless, this old man's was a patient hammer wielded by a patient arm. No murmur, no impatience, no petulance did come from him. Silent, slow, and solemn; bowing over still further his chronically broken back, he toiled away, as if toil were life itself, and the heavy beating of his hammer the heavy beating of his heart. And so it was.—Most miserable! A peculiar walk in this old man, a certain slight but painful appearing yawing in his gait, had at an early period of the voyage excited the curiosity of the mariners. And to the importunity of their persisted questionings he had finally given in; and so it came to pass that every one now knew the shameful story of his wretched fate. Belated, and not innocently, one bitter winter's midnight, on the road running between two country towns, the blacksmith half-stupidly felt the deadly numbness stealing over him, and sought refuge in a leaning, dilapidated barn. The issue was, the loss of the extremities of both feet. Out of this revelation, part by part, at last came out the four acts of the gladness, and the one long, and as yet uncatastrophied fifth act of the grief of his life's drama. He was an old man, who, at the age of nearly sixty, had postponedly encountered that thing in sorrow's technicals called ruin. He had been an artisan of famed excellence, and with plenty to do; owned a house and garden; embraced a youthful, daughter-like, loving wife, and three blithe, ruddy children; every Sunday went to a cheerful-looking church, planted in a grove. But one night, under cover of darkness, and further concealed in a most cunning disguisement, a desperate burglar slid into his happy home, and robbed them all of everything. And darker yet to tell, the blacksmith himself did ignorantly conduct this burglar into his family's heart. It was the Bottle Conjuror! Upon the opening of that fatal cork, forth flew the fiend, and shrivelled up his home. Now, for prudent, most wise, and economic reasons, the blacksmith's shop was in the basement of his dwelling, but with a separate entrance to it; so that always had the young and loving healthy wife listened with no unhappy nervousness, but with vigorous pleasure, to the stout ringing of her young-armed old husband's hammer; whose reverberations, muffled by passing through the floors and walls, came up to her, not unsweetly, in her nursery; and so, to stout Labor's iron lullaby, the blacksmith's infants were rocked to slumber. Oh, woe on woe! Oh, Death, why canst thou not sometimes be timely? Hadst thou taken this old blacksmith to thyself ere his full ruin came upon him, then had the young widow had a delicious grief, and her orphans a truly venerable, legendary sire to dream of in their after years; and all of them a care-killing competency.",
//   links: [],
//   images: [],
// }

// export const hn = {
//   title: 'Hacker News',
//   metaDescription: '',
//   content:
//     "Hacker Newsnew | past | comments | ask | show | jobs | submitlogin1.Nuclear: Desktop music player focused on streaming from free sources (github.com/nukeop)76 points by indigodaddy 1 hour ago | hide | 26 comments2.Claude Code: Now in Beta in Zed (zed.dev)174 points by meetpateltech 2 hours ago | hide | 124 comments3.Who Owns, Operates, and Develops Your VPN Matters (opentech.fund)22 points by sdsantos 36 minutes ago | hide | 4 comments4.Microsoft VibeVoice: A Frontier Open-Source Text-to-Speech Model (microsoft.github.io)283 points by lastdong 6 hours ago | hide | 125 comments5.A Random Walk in 10 Dimensions (2021) (galileo-unbound.blog)38 points by just_human 2 hours ago | hide | 6 comments6.Warp Code: the fastest way from prompt to production (warp.dev)34 points by brainless 1 hour ago | hide | 36 comments7.Svix (webhooks as a service) is hiring for a founding marketing lead (svix.com)27 minutes ago | hide8.Building the most accurate DIY CNC lathe in the world [video] (youtube.com)70 points by pillars 3 hours ago | hide | 17 comments9.Voyager is an interactive video generation model with realtime 3D reconstruction (github.com/tencent-hunyuan)254 points by mingtianzhang 6 hours ago | hide | 171 comments10.Launch HN: Risely (YC S25) – AI Agents for Universities20 points by danialasif 2 hours ago | hide | 9 comments11.John Coltrane's Tone Circle (roelsworld.eu)93 points by jim-jim-jim 4 hours ago | hide | 29 comments12.The 16-year odyssey it took to emulate the Pioneer LaserActive (readonlymemo.com)189 points by LaSombra 7 hours ago | hide | 35 comments13.Airbus B612 Cockpit Font (github.com/polarsys)92 points by Bogdanp 3 hours ago | hide | 61 comments14.Ask HN: Looking for Headless CMS Recommendation17 points by rakshithbellare 1 hour ago | hide | 10 comments15.Glow-in-the-dark houseplants shine in rainbow of colours (nature.com)32 points by bookofjoe 3 hours ago | hide | 28 comments16.Abstract Machine Models Also: what Rust got particularly right (dr-knz.net)46 points by mustache_kimono 4 hours ago | hide | 3 comments17.How to Give a Good Talk (sigplan.org)146 points by pykello 8 hours ago | hide | 50 comments18.Energy Dashboard (UK) (energydashboard.co.uk)99 points by zeristor 6 hours ago | hide | 69 comments19.Understanding Transformers Using a Minimal Example (rti.github.io)14 points by rttti 1 hour ago | hide | discuss20.Magic Lantern Is Back (magiclantern.fm)419 points by felipemesquita 13 hours ago | hide | 138 comments21.Sharing a mutable reference between Rust and Python (lilyf.org)26 points by Bogdanp 3 hours ago | hide | 2 comments22.Kernel-hack-drill and exploiting CVE-2024-50264 in the Linux kernel (a13xp0p0v.github.io)199 points by r4um 10 hours ago | hide | 34 comments23.Finding thousands of exposed Ollama instances using Shodan (cisco.com)117 points by rldjbpin 9 hours ago | hide | 55 comments24.MIT Study Finds AI Use Reprograms the Brain, Leading to Cognitive Decline (publichealthpolicyjournal.com)411 points by cainxinth 5 hours ago | hide | 402 comments25.With AI Boom, Dell's Datacenter Biz Is Finally Bigger Than Its PC Biz (nextplatform.com)85 points by rbanffy 7 hours ago | hide | 68 comments26.%CPU utilization is a lie (brendanlong.com)390 points by BrendanLong 17 hours ago | hide | 135 comments27.This blog is running on a recycled Google Pixel 5 (2024) (ctms.me)326 points by indigodaddy 18 hours ago | hide | 137 comments28.A staff engineer's journey with Claude Code (sanity.io)491 points by kmelve 21 hours ago | hide | 344 comments29.Lit: a library for building fast, lightweight web components (lit.dev)216 points by merqurio 11 hours ago | hide | 141 comments30.Comic Sans typeball designed to work with the IBM Selectric typewriters (printables.com)133 points by Sami_Lehtinen 14 hours ago | hide | 29 commentsMore Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact Search:",
//   links: [
//     'https://news.ycombinator.com/',
//     'https://news.ycombinator.com/news',
//     'https://news.ycombinator.com/newest',
//     'https://news.ycombinator.com/front',
//     'https://news.ycombinator.com/newcomments',
//     'https://news.ycombinator.com/ask',
//     'https://news.ycombinator.com/show',
//     'https://news.ycombinator.com/jobs',
//     'https://news.ycombinator.com/submit',
//     'https://news.ycombinator.com/login?goto=news',
//     'https://news.ycombinator.com/vote?id=45117230&how=up&goto=news',
//     'https://github.com/nukeop/nuclear',
//     'https://news.ycombinator.com/from?site=github.com/nukeop',
//     'https://news.ycombinator.com/user?id=indigodaddy',
//     'https://news.ycombinator.com/item?id=45117230',
//     'https://news.ycombinator.com/hide?id=45117230&goto=news',
//     'https://news.ycombinator.com/vote?id=45116688&how=up&goto=news',
//     'https://zed.dev/blog/claude-code-via-acp',
//     'https://news.ycombinator.com/from?site=zed.dev',
//     'https://news.ycombinator.com/user?id=meetpateltech',
//   ],
//   images: [
//     'https://news.ycombinator.com/y18.svg',
//     'https://news.ycombinator.com/s.gif',
//   ],
// }

// export const ld = {
//   title: 'Launch Day',
//   metaDescription: 'Dev Launcher',
//   content: 'RouletteEuropean Roulette',
//   links: [
//     'https://launch-day-pied.vercel.app/',
//     'https://launch-day-pied.vercel.app/roulette',
//     'https://x.com/',
//     'https://youtube.com/',
//     'https://github.com/',
//     'https://coderabbit.ai/',
//     'https://character.ai/',
//     'https://app.box.com/folder/0',
//     'https://claude.ai/',
//     'https://chatgpt.com/',
//     'https://grok.com/',
//     'https://t3.chat/',
//     'https://www.phind.com/',
//     'https://www.perplexity.ai/',
//     'https://developer.mozilla.org/en-US/',
//     'https://news.ycombinator.com/',
//     'https://console.firebase.google.com/u/0/',
//     'https://dashboard.convex.dev/',
//     'https://cloud.digitalocean.com/',
//     'https://cloud.redis.io/',
//   ],
//   images: [
//     'https://launch-day-pied.vercel.app/svg/logomark.svg',
//     'https://launch-day-pied.vercel.app/svg/starship.svg',
//     'https://launch-day-pied.vercel.app/svg/business-end.svg',
//     'https://launch-day-pied.vercel.app/svg/left_outer_blast.svg',
//     'https://launch-day-pied.vercel.app/svg/center_outer_blast.svg',
//     'https://launch-day-pied.vercel.app/svg/right_outer_blast.svg',
//   ],
// }
