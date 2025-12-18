import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    routeName?: string; // e.g. 'dashboard', 'users.*'
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    id: number;
    customer_id: number;
    brand: string;
    model: string;
    year: number;
    plate_no: string;
    customer: Customer;
    created_at: string;
    updated_at: string;
}

export interface Sparepart {
    id: number;
    sku: string;
    name: string;
    price: number;
    stock: number;
    min_stock: number;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: number;
    user_id: number;
    vehicle_id: number;
    mechanic_id?: number | null;
    date: string;
    complaint: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    user?: User;
    vehicle?: Vehicle;
    mechanic?: User;
    sparepart_usages?: SparepartUsage[];
    created_at: string;
    updated_at: string;
}

export interface SparepartUsage {
    id: number;
    booking_id: number;
    sparepart_id: number;
    qty: number;
    price_at_use: number;
    sparepart?: Sparepart;
    created_at: string;
    updated_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
};


