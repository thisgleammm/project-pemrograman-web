import * as React from 'react';
import { Table } from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    const [localPageSize, setLocalPageSize] = React.useState(`${table.getState().pagination.pageSize}`);
    const [localPageIndex, setLocalPageIndex] = React.useState(table.getState().pagination.pageIndex);

    // Extract values for useEffect dependencies
    const currentPageSize = table.getState().pagination.pageSize;
    const currentPageIndex = table.getState().pagination.pageIndex;

    // Sync pagination with table state
    React.useEffect(() => {
        setLocalPageSize(`${currentPageSize}`);
        setLocalPageIndex(currentPageIndex);
    }, [currentPageSize, currentPageIndex]);

    const canPrevious = localPageIndex > 0;
    const canNext = localPageIndex < table.getPageCount() - 1;

    return (
        <div className="flex items-center justify-end px-2">
            <div className="flex items-center gap-6 lg:gap-8">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={localPageSize}
                        onValueChange={(value) => {
                            setLocalPageSize(value);
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center text-sm font-medium min-w-[100px]">
                    Page {localPageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            table.setPageIndex(0);
                            setLocalPageIndex(0);
                        }}
                        disabled={!canPrevious}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            table.previousPage();
                            setLocalPageIndex(prev => prev - 1);
                        }}
                        disabled={!canPrevious}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            table.nextPage();
                            setLocalPageIndex(prev => prev + 1);
                        }}
                        disabled={!canNext}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            const lastPage = table.getPageCount() - 1;
                            table.setPageIndex(lastPage);
                            setLocalPageIndex(lastPage);
                        }}
                        disabled={!canNext}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
