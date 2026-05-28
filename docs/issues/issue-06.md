# Issue 06 — Context Providers (Auth, Toast, Cart)

**Suggested Branch:** `[YOUR-INITIALS]-issue-06-context-providers-auth`


**Labels:** `feature`, `frontend` | **Priority:** 🔴 Critical | **Depends on:** Issues 04, 12

## Checklist
- [ ] **Prerequisite:** Ensure Issues 04, 12 are completed.
- [ ] Create `src/components/providers/AuthProvider.tsx`
- [ ] Create `src/components/providers/ToastProvider.tsx`
- [ ] Create `src/components/providers/CartProvider.tsx`

> ⚠️ All three files must use the `'use client'` directive at the top.

## Files to Create

### File 1 — `src/components/providers/AuthProvider.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> This wraps NextAuth's `SessionProvider`. All components that previously used `useAuth()` should now use `useSession()` from `next-auth/react`.

```	tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

> ⚠️ **Migration Note:** Replace all `useAuth()` calls in other components with `useSession()` from `next-auth/react`:
> - `const { user, logout } = useAuth()` → `const { data: session } = useSession()` + `signOut()` from `next-auth/react`
> - `user` → `session?.user`
> - `user.role` → `session?.user?.role`
> - `login(email, password)` → `signIn('credentials', { email, password, redirect: false })`
> - `logout()` → `signOut()`
```

---

### File 2 — `src/components/providers/ToastProvider.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	sx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type= 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const typeStyles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-accent text-white',
    warning: 'bg-warning text-white',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${typeStyles[toast.type]} animate-fade-in-up flex items-center gap-3 rounded-lg px-5 py-3 font-ui text-sm shadow-dropdown min-w-[280px] max-w-[420px]`}
            role="alert"
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
```

---

### File 3 — `src/components/providers/CartProvider.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	sx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getCartAction, addToCartAction, updateCartQuantityAction, removeCartItemAction } from '@/lib/actions/cart';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = item.product ? Number(item.product.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getCartAction();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      const data = await addToCartAction(productId, quantity);
      if (data.success) {
        await refreshCart();
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to add item' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
    try {
      await updateCartQuantityAction(cartItemId, quantity);
    } catch {
      refreshCart();
    }
  };

  const removeItem = async (cartItemId) => {
    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    try {
      await removeCartItemAction(cartItemId);
    } catch {
      refreshCart();
    }
  };


  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, count, total, isLoading, addItem, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```
