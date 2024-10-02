import styles from "../../../styles/components/forms.module.scss";
import { useForm } from "@mantine/form";

export const Filters = () => {
  const form = useForm({});

  return (
    <div className={styles.Filters}>
      <form onSubmit={form.onSubmit((values) => console.log(values))}></form>
    </div>
  );
};
