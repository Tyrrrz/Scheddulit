import Link from '@/components/link';
import useToken from '@/hooks/useToken';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  const [token] = useToken();

  if (token) {
    return <div>Logged in!</div>;
  }

  return (
    <div>
      <Link href="/auth">Authenticate</Link>
    </div>
  );
};

export default HomePage;
