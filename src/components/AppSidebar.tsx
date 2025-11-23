import { User, History, LogIn, Home, Settings as SettingsIcon } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { state } = useSidebar();
  const { settings, isLoggedIn } = useApp();
  const { t } = useTranslation();
  const collapsed = state === 'collapsed';
  const isLargeText = settings.largeText;

  const menuItems = [
    { title: t('home'), url: '/home', icon: Home },
    { title: t('orders'), url: '/order-history', icon: History },
    { title: t('profileMenu'), url: '/profile', icon: User },
    { title: t('settingsMenu'), url: '/settings', icon: SettingsIcon },
    { title: t('login'), url: '/auth', icon: LogIn },
  ];

  // Filter out Login option if user is logged in
  const visibleMenuItems = menuItems.filter(item => {
    if (item.title === 'Login' && isLoggedIn) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-60'} bg-card border-r border-border`} collapsible="icon">
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className={isLargeText ? 'text-lg' : ''}>
            {!collapsed && t('menuLabel')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} ${collapsed ? '' : 'mr-2'}`} />
                      {!collapsed && (
                        <span className={isLargeText ? 'text-lg' : ''}>
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
