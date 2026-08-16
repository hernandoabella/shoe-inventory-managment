"use client";

import { Menu, Search, Bell, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface HeaderProps {
  onMenuClick?: () => void;
}

const typeDotClass: Record<string, string> = {
  low_stock: "bg-amber-500",
  transfer: "bg-blue-500",
  purchase: "bg-violet-500",
  receiving: "bg-emerald-500",
  system: "bg-gray-400",
};

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: (n: Notification) => void;
}) {
  return (
    <button
      onClick={() => onOpen(notification)}
      className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
        !notification.read ? "bg-indigo-50/40" : ""
      }`}
    >
      <div
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          typeDotClass[notification.type] || typeDotClass.system
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {notification.title}
        </p>
        <p className="line-clamp-2 text-sm text-gray-600">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
      )}
    </button>
  );
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleOpenNotification = (n: Notification) => {
    markAsRead(n.id);
    setIsNotificationsOpen(false);
    if (n.link) router.push(n.link);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Abrir menú"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop search */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos, SKU, categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-indigo-400 focus:bg-white"
          />
        </form>
      </div>

      {/* Mobile search toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Buscar"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div
          ref={searchRef}
          className="absolute left-0 right-0 top-full bg-white p-4 shadow-lg md:hidden"
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-10 text-sm outline-none focus:border-indigo-400"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Marcar todas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-gray-400">
                    No hay notificaciones
                  </p>
                ) : (
                  notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onOpen={handleOpenNotification}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
