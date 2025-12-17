import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Ziggy } from '@/ziggy';
import { route } from 'ziggy-js';

import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Car, Wrench, NotebookPen } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const dashboardItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard', undefined, undefined, Ziggy),
            icon: LayoutGrid,
            routeName: 'dashboard',
        },
    ];

    const masterDataItems: NavItem[] = [
        {
            title: 'Customers',
            href: route('customer.index', undefined, undefined, Ziggy),
            icon: Users,
            routeName: 'customer.*',
        },
        {
            title: 'Vehicle',
            href: route('vehicle.index', undefined, undefined, Ziggy),
            icon: Car,
            routeName: 'vehicle.*',
        },
        {
            title: 'Sparepart',
            href: route('sparepart.index', undefined, undefined, Ziggy),
            icon: Wrench,
            routeName: 'sparepart.*',
        },
        {
            title: 'Booking',
            href: route('booking.index', undefined, undefined, Ziggy),
            icon: NotebookPen,
            routeName: 'booking.*',
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={route(
                                    'dashboard',
                                    undefined,
                                    undefined,
                                    Ziggy,
                                )}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={dashboardItems} />
                <NavMain items={masterDataItems} label="Master Data" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
