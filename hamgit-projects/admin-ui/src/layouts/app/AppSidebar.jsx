import {
  ChevronLeftIcon,
  CircleLoadingIcon,
  CreditCardIcon,
  DocumentIcon,
  HandInIcon,
  HomeIcon,
  LogoutIcon,
  StoreIcon,
  UserIcon,
} from '@/components/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/Sidebar'
import useCollapse from '@/hooks/use-collapse'
import { useState } from 'react'
import { cn } from '@/utils/dom'
import { useAuthContext } from '@/features/auth'
import { useLocation } from 'react-router-dom'
import { AdsIcon } from '@/components/icons/AdsIcon'
import { TagIcon } from '@/components/icons/TagIcon'

const items = [
  {
    title: 'داشبورد',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'قراردادها',
    url: '#',
    icon: DocumentIcon,
    rolesHaveAccess: ['SUPERUSER', 'STAFF', 'CONTRACT_ADMIN', 'AUDITOR'],
    items: [
      {
        title: 'ایجاد قرارداد',
        url: '/contracts/new',
        rolesHaveAccess: ['SUPERUSER', 'STAFF', 'CONTRACT_ADMIN'],
      },
      {
        title: 'رهن و اجاره',
        url: '/contracts/prs',
      },
      {
        title: 'بندهای پیش‌فرض عادی',
        url: '/clauses/default',
        rolesHaveAccess: ['SUPERUSER'],
      },
      {
        title: 'بندهای پیش‌فرض ضمانتی',
        url: '/clauses/guaranteed',
        rolesHaveAccess: ['SUPERUSER'],
      },
    ],
  },
  {
    title: 'کاربران',
    url: '#',
    icon: UserIcon,
    rolesHaveAccess: ['SUPERUSER', 'STAFF'],
    items: [
      {
        title: 'ایجاد کاربر',
        url: '/users/new',
      },
      {
        title: 'لیست کاربران',
        url: '/users',
      },
    ],
  },
  {
    title: 'آگهی‌ها',
    url: '#',
    icon: AdsIcon,
    rolesHaveAccess: ['SUPERUSER', 'STAFF', 'AD_MODERATOR', 'CONTRACT_ADMIN'],
    items: [
      {
        title: 'ایجاد آگهی',
        url: '/ads/list/create',
      },
      {
        title: 'لیست آگهی‌ها',
        url: '/ads/list',
      },
      {
        title: 'درخواست‌های بازدید',
        url: '/ads/visit-requests',
      },
    ],
  },
  {
    title: 'نیازمندی‌ها',
    url: '#',
    icon: HandInIcon,
    rolesHaveAccess: ['SUPERUSER', 'STAFF', 'AD_MODERATOR'],
    items: [
      {
        title: 'ایجاد نیازمندی',
        url: '/requirements/buy-and-rental/create',
      },
      {
        title: 'لیست خرید و رهن',
        url: '/requirements/buy-and-rental',
      },
      {
        title: 'ایجاد معاوضه',
        url: '/requirements/barter/create',
      },
      {
        title: 'لیست معاوضه',
        url: '/requirements/barter',
      },
    ],
  },
  {
    title: 'کد تخفیف',
    url: '#',
    icon: TagIcon,
    rolesHaveAccess: ['SUPERUSER'],
    items: [
      { title: 'ساخت کد تخفیف', url: '/promo-codes/create' },
      { title: 'لیست کد تخفیف', url: '/promo-codes' },
    ],
  },
  {
    title: 'پرداخت‌ها',
    url: '#',
    icon: CreditCardIcon,
    rolesHaveAccess: ['SUPERUSER', 'STAFF'],
    items: [
      {
        title: 'لینک‌های پرداخت',
        url: '/custom-invoices',
      },
      {
        title: 'درخواست‌های برداشت',
        url: '/settlements',
      },
    ],
  },
  {
    title: 'کیف پول',
    url: '#',
    icon: CreditCardIcon,
    rolesHaveAccess: ['SUPERUSER', 'STAFF'],
    items: [
      {
        title: 'شارژ کیف پول',
        url: '/wallets/manual-charge',
      },
    ],
  },
  {
    title: 'بازار',
    url: '#',
    icon: StoreIcon,
    rolesHaveAccess: ['SUPERUSER', 'AD_MODERATOR'],
    items: [
      {
        title: 'ایجاد فایل',
        url: '#',
        items: [
          {
            title: 'خریدار',
            url: '/market/buy-sell/buyer/create',
          },
          {
            title: 'فروشنده',
            url: '/market/buy-sell/seller/create',
          },
          {
            title: 'مالک',
            url: '/market/deposit-rent/landlord/create',
          },
          {
            title: 'مستاجر',
            url: '/market/deposit-rent/tenant/create',
          },
        ],
      },
      {
        title: 'ایجاد مشاور املاک',
        url: '/market/realtor/create',
      },
      {
        title: 'لیست مشاور املاک',
        url: '/market/realtor',
      },
      {
        title: 'لیست فایل رهن و اجاره',
        url: '/market/deposit-rent/landlord',
      },
      {
        title: 'لیست فایل خرید و فروش',
        url: '/market/buy-sell/buyer',
      },
      {
        title: 'ایجاد وظیفه',
        url: '/market/task/create',
      },
      {
        title: 'لیست وظایف',
        url: '/market/task',
      },
      {
        title: 'تنظیمات بازار',
        url: '/market/settings',
        rolesHaveAccess: ['SUPERUSER'],
      },
    ],
  },
]

const AppSidebarItem = ({ item, recalculateParent }) => {
  const { currentUser } = useAuthContext()
  const location = useLocation()
  const defaultOpen =
    item.items?.length > 0 ? item.items.some((i) => location.pathname.includes(i.url)) : false

  const [collapsed, setCollapsed] = useState(!defaultOpen)
  const { open, isMobile, toggleSidebar } = useSidebar()
  const { ref, recalculateHeight } = useCollapse(!collapsed)

  const currentUserRoles = currentUser?.roles || []

  const canAccess = (rolesHaveAccess) =>
    !rolesHaveAccess?.length || rolesHaveAccess.some((role) => currentUserRoles.includes(role))

  const handleClick = () => {
    if (!item.items?.length) {
      if (isMobile) {
        toggleSidebar()
      }
      return
    }

    if (!open) {
      toggleSidebar()
      setCollapsed(false)
    } else {
      setCollapsed((s) => !s)
    }

    setTimeout(() => recalculateParent?.(), 0)
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton href={item.url} onClick={() => handleClick()}>
        {item.icon && (!defaultOpen ? <item.icon /> : <item.icon className="text-teal-700" />)}
        <span className={cn({ 'text-teal-700': defaultOpen })}>{item.title}</span>
        {item.items?.length > 0 && (
          <ChevronLeftIcon
            className={cn('mr-auto transition-transform duration-100', {
              '-rotate-90': !collapsed,
            })}
          />
        )}
      </SidebarMenuButton>
      <SidebarMenuSub ref={ref} className="overflow-hidden ">
        {item.items?.map(
          (subItem) =>
            canAccess(subItem.rolesHaveAccess) &&
            (subItem.items ? (
              <AppSidebarItem
                key={subItem.title}
                item={subItem}
                recalculateParent={recalculateHeight}
              />
            ) : (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton href={subItem.url}>{subItem.title}</SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))
        )}
      </SidebarMenuSub>
    </SidebarMenuItem>
  )
}

const AppSidebar = () => {
  const { isLoadingCurrentUser, currentUser, logoutMutation } = useAuthContext()

  const currentUserRoles = currentUser?.roles || []

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <img src="/images/logo-icon.svg" alt="logo" className="w-10" />
              <span className="font-black">پنل مدیریت املاین</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (
                  item.rolesHaveAccess &&
                  item.rolesHaveAccess.length > 0 &&
                  !item.rolesHaveAccess.some((role) => currentUserRoles.includes(role))
                )
                  return null

                return <AppSidebarItem key={item.title} item={item} />
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="outline">
              <UserIcon />
              <span>{isLoadingCurrentUser ? '...' : currentUser?.name || currentUser?.mobile}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogoutIcon />
              <span>
                {logoutMutation.isPending ? (
                  <CircleLoadingIcon size={16} className="animate-spin " />
                ) : (
                  'خروج'
                )}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
