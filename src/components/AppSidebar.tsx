import { User, History, LogIn, Home, Settings as SettingsIcon } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useApp } from '@/contexts/AppContext';
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

const menuItems = [
  { title: 'Home', url: '/home', icon: Home },
  { title: 'Order History', url: '/order-history', icon: History },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: SettingsIcon },
  { title: 'Login', url: '/auth', icon: LogIn },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { settings } = useApp();
  const collapsed = state === 'collapsed';
  const isLargeText = settings.largeText;

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-60'} bg-card border-r border-border`} collapsible="icon">
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className={isLargeText ? 'text-lg' : ''}>
            {!collapsed && 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
