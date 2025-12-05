import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { file } = context.params || {};
  
  return {
    redirect: {
      destination: `/public/WHO_TMGS_II/${file}`,
      permanent: false,
    },
  };
};

export default function WHO_TMGS_II() {
  return null;
}
