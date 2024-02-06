"use client"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X, AlignRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import StoreSwitcher from "@/components/store-switcher";
import logo from "@/app/favicon.svg"
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavigationMenuComponent({ stores }: any) {
const pathname = usePathname();
const params = useParams();
const routes = [
    {
        href: `/${params.storeId}`,
        label: 'Overview',
        active: pathname === `/${params.storeId}`
    },
    {
        href: `/${params.storeId}/billboards`,
        label: 'Billboards',
        active: pathname === `/${params.storeId}/billboards`
    },
    {
        href: `/${params.storeId}/categories`,
        label: 'Categories',
        active: pathname === `/${params.storeId}/categories`
    },
    {
        href: `/${params.storeId}/settings`,
        label: 'Settings',
        active: pathname === `/${params.storeId}/settings`
    },
];
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
    <div className="border-b fixed top-0 w-full bg-white z-10">
        <div className="flex h-16 items-center px-4">
                <div className="lg:mr-4">
                <Link href="/">
                        <Image
                        className="h-8 w-8" 
                        src={logo}
                        alt="Logo"
                        />
                    </Link>
                </div>
                <div className="ml-auto lg:ml-0">
                    <StoreSwitcher items={stores}/>
                </div>
                <div className="hidden lg:block">
                    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                        {routes.map((route) => (
                            <Link onClick={() => {
                                closeMenu();
                              }} key={route.href} href={route.href}
                            className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="hidden lg:block ml-auto items-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                </div>
                <div className="lg:hidden ml-auto">
                <Sheet open={isOpen} onOpenChange={isOpen ? closeMenu : openMenu}>
                <SheetTrigger>
                    {isOpen ? (
                    <X className="h-6 w-6 block lg:hidden" onClick={closeMenu} />
                    ) : (
                    <AlignRight className="h-6 w-6 block lg:hidden" onClick={openMenu} />
                    )}
                </SheetTrigger>
                <SheetContent className="flex flex-col pt-10">
                    {isOpen && <UserButton afterSignOutUrl="/"/>}
                    <nav className="flex flex-col items-center">
                        {routes.map((route) => (
                            <Link onClick={() => {
                                closeMenu();
                              }} key={route.href} href={route.href}
                                className={cn("pt-10 text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
                </Sheet>
                </div>
                
        </div>
      </div>
    </>
  );
}
