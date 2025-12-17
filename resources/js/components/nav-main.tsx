import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function NavMain({
    items = [],
    label,
}: {
    items: NavItem[];
    label?: string;
}) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {label && (
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {label}
                </div>
            )}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={
                                item.routeName
                                    ? route().current(item.routeName)
                                    : page.url.startsWith(resolveUrl(item.href))
                            }
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
