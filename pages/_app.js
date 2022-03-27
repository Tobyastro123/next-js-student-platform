import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import { useCallback, useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  const refreshUserProfile = useCallback(async () => {
    const response = await fetch('/api/profile');
    const data = await response.json();
    console.log(data);

    if ('errors' in data) {
      console.log(data.errors);
      setUser(undefined);
      return;
    }

    setUser(data.user);
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => {});
  }, [refreshUserProfile]);

  return (
    <Component
      {...pageProps}
      userObject={user}
      refreshUserProfile={refreshUserProfile}
    />
  );
}

export default MyApp;
