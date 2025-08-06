"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Users, Boxes, List, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin/users", label: "Users", icon: <Users className="w-4 h-4" /> },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: <Boxes className="w-4 h-4" />,
  },
  { href: "/admin/logs", label: "Logs", icon: <List className="w-4 h-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white p-4">
            <nav className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive(item.href) ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="mt-4 text-red-600 justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:border-r md:p-6 bg-white">
        <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isActive(item.href) ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="mt-6 text-red-600 justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </aside>
    </>
  );
}
