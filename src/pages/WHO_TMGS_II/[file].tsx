import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { file } = context.params || {};

  // In Next.js, files in the public folder are served without the /public/ prefix
  // So /public/WHO_TMGS_II/file.pdf should be accessed as /WHO_TMGS_II/file.pdf
  return {
    redirect: {
      destination: `/WHO_TMGS_II/${file}`,
      permanent: false,
    },
  };
};

export default function WHO_TMGS_II() {
  return null;
}
