import { GetStaticProps, NextPage } from 'next';
import { getFakeData } from 'scheddulit-data';

type HomePageProps = {
  data: {
    foo: string;
  };
};

const HomePage: NextPage<HomePageProps> = ({ data }) => {
  return <div>{JSON.stringify(data)}</div>;
};

export const getStaticProps: GetStaticProps<HomePageProps> = () => {
  return {
    props: {
      data: getFakeData()
    }
  };
};

export default HomePage;
