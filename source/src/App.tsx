import { useEffect, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import type { SimMode } from './components/layout/PrototypeBar';
import { useFontScale } from './lib/fontScale';
import { PlaceholderPage } from './PlaceholderPage';
import { PLANS, type PlanId } from './data/content';
import { ArticlePage } from './pages/ArticlePage';
import { CaregiverPage } from './pages/CaregiverPage';
import { GuidePage } from './pages/GuidePage';
import { PlanPage } from './pages/PlanPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SourcesPage } from './pages/SourcesPage';
import { UnderstandPage } from './pages/UnderstandPage';
import { Hero } from './sections/Hero';
import { IdentitySection } from './sections/IdentitySection';
import { QuickSearch } from './sections/QuickSearch';
import { ResourceFinder } from './sections/ResourceFinder';
import { StageSection } from './sections/StageSection';

/** 以 hash 區分「頁面路由（#/…）」與「頁內錨點（#section）」 */
function useRoute() {
  const read = () => (window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '/');
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      const h = window.location.hash;
      if (h.startsWith('#/')) { setRoute(read()); window.scrollTo(0, 0); document.getElementById('main')?.focus(); }
      else if (h) {
        setRoute('/');
        requestAnimationFrame(() => document.getElementById(h.slice(1))?.scrollIntoView());
      }
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

/** 內頁路由：#/understand、#/guide、#/article/:id、#/plan/:id、#/resources?kind=、#/caregiver、#/sources */
function Page({ route, sim }: { route: string; sim: SimMode }) {
  const [path, query = ''] = route.split('?');
  const qs = new URLSearchParams(query);
  const [, a = '', b = ''] = path.split('/');
  switch (a) {
    case 'understand': return <UnderstandPage />;
    case 'guide': case 'scenarios': return <GuidePage />;
    case 'article': return <ArticlePage key={b} id={b} />;
    case 'plan': return b in PLANS ? <PlanPage key={route} id={b as PlanId} sit={qs.get('sit') ?? undefined} /> : <PlaceholderPage route={route} />;
    case 'resources': return <ResourcesPage key={route} sim={sim} kind={qs.get('kind') ?? ''} view={qs.get('view') ?? ''} />;
    case 'caregiver': return <CaregiverPage />;
    case 'sources': return <SourcesPage />;
    default: return <PlaceholderPage route={route} />;
  }
}

export default function App() {
  const route = useRoute();
  const [scale, setScale] = useFontScale();
  const sim: SimMode = 'auto';
  const home = route === '/' || route === '';

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>跳到主要內容</a>
      <Header route={route} scale={scale} onScale={setScale} />
      <main id="main" tabIndex={-1} className="outline-none">
        {home ? (
          <>
            <Hero />
            <IdentitySection />
            <QuickSearch sim={sim} />
            <StageSection />
            <ResourceFinder sim={sim} />
          </>
        ) : <Page route={route} sim={sim} />}
      </main>
      <Footer />
    </>
  );
}
