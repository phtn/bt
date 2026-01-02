// import {
//   CPopoverBody,
//   CPopoverButton,
//   CPopoverContent,
//   CPopoverHeader,
//   CPopoverRoot,
//   CPopoverTrigger,
// } from '@/components/ui/cultover'
// import { Icon, type IconName } from '@/lib/icons'

// interface IAction {
//   icon: IconName;
//   label: string;
//   action: VoidFunction;
// }

// interface Props<T> {
//   title?: string;
//   children?: React.ReactNode;
//   struct: T;
//   actions: IAction[];
// }

// export const QuickActions = <T extends { name: string }>({
//   title,
//   children,
//   actions,
// }: Props<T>) => {

//   return (
//     <CPopoverRoot>
//       <CPopoverTrigger className='dark:bg-transparent border-none text'>
//         {children}
//       </CPopoverTrigger>
//       <CPopoverContent className='z-200 w-52 dark:bg-neutral-700 opacity-100 h-fit'>
//         <div className='w-full flex items-center pt-4 justify-center size-20' />
//         <CPopoverHeader className='w-full h-6 text-center'>
//           <span className=' text-orange-200 font-mono text-xs tracking-wide'>
//             {title}
//           </span>
//         </CPopoverHeader>
//         <CPopoverBody className='z-60'>
//           {actions.map((action, index) => (
//             <CPopoverButton
//               className='text-xs  hover:bg-zinc-200/30 space-x-2'
//               key={index}
//               onClick={action.action}
//             >
//               <Icon name={action.icon} className='size-4' />
//               <span className=''>{action.label}</span>
//             </CPopoverButton>
//           ))}
//         </CPopoverBody>
//       </CPopoverContent>
//     </CPopoverRoot>
//   )
// }
