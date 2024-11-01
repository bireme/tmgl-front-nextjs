import {
  Button,
  Container,
  Flex,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import {
  MailChimpResponse,
  MailChimpService,
} from "@/services/mailchimp/MailChimpService";
import { isEmail, useForm } from "@mantine/form";
import { useEffect, useState } from "react";

import styles from "../../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export const NewsletterSection = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email"),
    },
  });
  const _subscribeService = new MailChimpService();
  const handleSubscribe = async () => {
    setLoading(true);
    const { email } = form.values;
    const response: MailChimpResponse = await _subscribeService.subscribeEmail(
      email
    );
    if (response.status == true) {
      router.push("/subscription");
    } else {
      if (response.message?.includes("is already a list member. Use PUT"))
        setError("Your email has already been registered previously");
      else setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className={styles.NewsletterSection}>
      {loading ? (
        <>
          <LoadingOverlay visible={loading} />
        </>
      ) : (
        <></>
      )}
      <Container size={"xl"}>
        <Flex justify={"flex-start"} align={"center"}>
          <form
            onSubmit={form.onSubmit(() => {
              handleSubscribe();
            })}
          >
            <h4>Join the TMGL Community</h4>
            <h5>
              TCIM news, events, opportunities and updates, monthly in your
              inbox
            </h5>
            <Flex gap={"10px"} style={{ width: "100%" }}>
              <TextInput
                key={form.key("email")}
                {...form.getInputProps("email")}
                style={{ width: "30%" }}
                size={"md"}
              />
              <Button type={"submit"} size={"md"}>
                Subscribe
              </Button>
            </Flex>
            {error != "" ? (
              <>
                <p style={{ color: "white" }}>{error}</p>
              </>
            ) : (
              <></>
            )}
          </form>
        </Flex>
      </Container>
      <div
        className={styles.NewsImageBg}
        style={{ backgroundImage: `url(/local/png/img-newsletter.png)` }}
      />
    </div>
  );
};
