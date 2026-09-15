import dynamic from 'next/dynamic';
import Hero from '@/components/scenes/Hero';

const sceneLoading = <div className="h-screen w-full bg-charcoal" />;

const HistoriaScene = dynamic(() => import('@/components/scenes/HistoriaScene'), {
  loading: () => sceneLoading,
});
const FireSelectionScene = dynamic(() => import('@/components/scenes/FireSelectionScene'), {
  loading: () => sceneLoading,
});
const DailyScene = dynamic(() => import('@/components/scenes/DailyScene'), {
  loading: () => sceneLoading,
});
const SmokeScene = dynamic(() => import('@/components/scenes/SmokeScene'), {
  loading: () => sceneLoading,
});
const ChefScene = dynamic(() => import('@/components/scenes/ChefScene'), {
  loading: () => sceneLoading,
});
const BlackReserveScene = dynamic(() => import('@/components/scenes/BlackReserveScene'), {
  loading: () => sceneLoading,
});
const Footer = dynamic(() => import('@/components/scenes/Footer'), {
  loading: () => <div className="h-96 w-full bg-charcoal-light" />,
});

export default function Home() {
  return (
    <main>
      <Hero />
      <HistoriaScene />
      <FireSelectionScene />
      <DailyScene />
      <SmokeScene />
      <ChefScene />
      <BlackReserveScene />
      <Footer />
    </main>
  );
}
