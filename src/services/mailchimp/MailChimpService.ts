export interface MailChimpResponse {
  message?: string;
  status?: boolean;
  data?: any;
}

export class MailChimpService {
  public subscribeEmail = async (email: string): Promise<MailChimpResponse> => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Verifica se a resposta está em JSON e captura a mensagem
      let data;
      try {
        data = await response.json();
      } catch (error) {
        // Caso a resposta não seja JSON, define `data` como vazio ou nulo
        data = null;
      }

      if (response.ok) {
        if (data.status == true) {
          return {
            status: true,
          };
        } else {
          return {
            status: false,
            message: data?.message ?? "Something went wrong",
          };
        }
      } else {
        return {
          status: false,
          message: data?.message ?? "Something went wrong",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Something went wrong, try again later",
      };
    }
  };
}
