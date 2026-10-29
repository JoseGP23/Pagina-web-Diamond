'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { findProduct, type LineId } from '@/lib/catalog';
import { itemKey, type CartItem } from '@/lib/order';
import { scrollToElement } from '@/lib/scroll';

// La ficha y el panel del pedido no hacen falta para pintar la página:
// se descargan aparte, cuando el navegador queda libre o al primer uso.
const loadProductSheet = () => import('@/components/order/ProductSheet');
const loadCartPanel = () => import('@/components/order/CartPanel');
const ProductSheet = dynamic(loadProductSheet, { ssr: false });
const CartPanel = dynamic(loadCartPanel, { ssr: false });

const CART_STORAGE_KEY = 'diamante-cart-v1';

type OrderActions = {
  addItem: (item: Omit<CartItem, 'key'>) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  /** Abre la ficha de un producto. */
  openProduct: (id: string) => void;
  openCart: () => void;
  setActiveLine: (line: LineId) => void;
  /** Lleva al armador de pedidos con una línea ya elegida. */
  browseLine: (line: LineId) => void;
};

type OrderState = {
  items: CartItem[];
  count: number;
  /** Línea elegida en el armador de pedidos. */
  activeLine: LineId;
  /** Cambia cada vez que se agrega algo (para animar el botón del carrito). */
  addedTick: number;
};

// Dos contextos: las escenas solo necesitan las acciones (que no cambian),
// así agregar un producto no vuelve a renderizar el carrusel ni las escenas.
const ActionsContext = createContext<OrderActions | null>(null);
const StateContext = createContext<OrderState | null>(null);

export function useOrderActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useOrderActions debe usarse dentro de <OrderProvider>');
  return ctx;
}

export function useOrder() {
  const state = useContext(StateContext);
  const actions = useContext(ActionsContext);
  if (!state || !actions) throw new Error('useOrder debe usarse dentro de <OrderProvider>');
  return { ...state, ...actions };
}

/** Solo productos que siguen en el catálogo (el catálogo puede cambiar entre visitas). */
function readSavedCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (i): i is CartItem => typeof i?.key === 'string' && typeof i?.qty === 'number' && Boolean(findProduct(i.productId)),
    );
  } catch {
    // Sin almacenamiento (modo privado) o datos dañados: carrito vacío.
    return [];
  }
}

/**
 * Estado del pedido: carrito (se conserva al cambiar de línea y al recargar
 * la página, solo en este navegador), ficha de producto y panel del pedido.
 */
export default function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeLine, setActiveLine] = useState<LineId>('fire');
  const [addedTick, setAddedTick] = useState(0);

  useEffect(() => {
    setItems(readSavedCart());
    setLoaded(true);

    // Precarga de la ficha y el panel cuando el navegador queda libre.
    const preload = () => {
      loadProductSheet();
      loadCartPanel();
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 2500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorado: ver readSavedCart.
    }
  }, [items, loaded]);

  const addItem = useCallback((item: Omit<CartItem, 'key'>) => {
    const key = itemKey(item);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i));
      return [...prev, { ...item, key }];
    });
    setAddedTick((t) => t + 1);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const browseLine = useCallback((line: LineId) => {
    setActiveLine(line);
    setCartOpen(false);
    const target = document.getElementById('pedido');
    if (target) scrollToElement(target);
  }, []);

  const actions = useMemo<OrderActions>(
    () => ({
      addItem,
      setQty,
      removeItem,
      clearCart: () => setItems([]),
      openProduct: setProductId,
      openCart: () => setCartOpen(true),
      setActiveLine,
      browseLine,
    }),
    [addItem, setQty, removeItem, browseLine],
  );

  const state = useMemo<OrderState>(
    () => ({ items, count: items.length, activeLine, addedTick }),
    [items, activeLine, addedTick],
  );

  const closeProduct = useCallback(() => setProductId(null), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>
        {children}
        <ProductSheet productId={productId} onClose={closeProduct} />
        <CartPanel open={cartOpen} onClose={closeCart} />
      </StateContext.Provider>
    </ActionsContext.Provider>
  );
}
