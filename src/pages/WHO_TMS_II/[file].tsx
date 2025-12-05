import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { file } = context.params || {};
  
  return {
    redirect: {
      destination: `/public/WHO_TMS_II/${file}`,
      permanent: false,
    },
  };
};

export default function WHO_TMS_II() {
  return null;
}
