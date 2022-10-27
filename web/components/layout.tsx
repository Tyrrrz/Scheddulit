import Meta from '@/components/meta';
import VercelAnalytics from '@/components/vercelAnalytics';
import useDebounce from '@/hooks/useDebounce';
import useRouterStatus from '@/hooks/useRouterStatus';
import c from 'classnames';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import FadeIn from 'react-fade-in';

const Loader: FC = () => {
  // Only show loading indicator if the navigation takes a while.
  // This prevents indicator from flashing during faster navigation.
  const isVisible = useDebounce(useRouterStatus() === 'loading', 300);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      // Progress is not representative of anything, it's just used
      // to give a sense that something is happening.
      // The value is increased inverse-hyperbolically, so that it
      // slows down and never actually reaches 100%.
      setProgress((progress) => progress + 0.1 * (0.95 - progress) ** 2);
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div
      className={c('h-1', {
        'bg-red-500': isVisible
      })}
      style={{
        width: `${progress * 100}%`,
        transitionProperty: 'width',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms'
      }}
    />
  );
};

const Header: FC = () => {
  return <></>;
};

const Breadcrumb: FC = () => {
  return <></>;
};

const Main: FC<PropsWithChildren> = ({ children }) => {
  // Below is a hack to re-initialize the fade when the page changes
  const router = useRouter();
  const fadeKey = useMemo(() => Math.random().toString() + router.pathname, [router.pathname]);

  return (
    <main>
      <FadeIn key={fadeKey}>{children}</FadeIn>
    </main>
  );
};

const Footer: FC = () => {
  return <></>;
};

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={c('flex', 'flex-col', 'min-h-screen', 'bg-neutral-50')}>
      <Meta />
      <VercelAnalytics />

      <Loader />

      <Header />
      <Breadcrumb />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Layout;
