import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import '@/styles/globals.css';
import { userService } from '@/services/usersService';
import { Nav } from '@/components/Nav';
import { Alert } from '@/components/Alert';
import { Footer } from '@/components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { asPath, events } = router;
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    function authCheck(url: string) {

      setUser(userService.userValue);

      const publicPaths = ['/account/login', '/account/register'];

      const path = url.split('?')[0];

      if (!userService.userValue && !publicPaths.includes(path)) {
        setAuthorized(false);
        router.push({
          pathname: '/account/login',
          query: { returnUrl: asPath }
        });
      } else {
        setAuthorized(true);
      }

    }

    authCheck(asPath);

    const hideContent = () => setAuthorized(false);
    events.on('routeChangeStart', hideContent);

    events.on('routeChangeComplete', authCheck)

    return () => {
      events.off('routeChangeStart', hideContent);
      events.off('routeChangeComplete', authCheck);
    }

  }, [router, asPath, events]);

  return (
    <>
      <Head>
        <title>User Auth</title>
      </Head>

      <div className={`app-container ${user ? 'bg-light' : ''}`}>
        <Nav />
        <Alert />
        {authorized &&
          <Component {...pageProps} />
        }
        <Footer />
      </div>
    </>
  );
}