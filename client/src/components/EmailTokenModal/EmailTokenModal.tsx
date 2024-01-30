import "./EmailTokenModal.css";
import axios, { AxiosError } from "axios";
import { AuthService } from "../../utils/auth";

interface tokenProps {
  eToken: string | undefined;
}

export function EmailTokenModal({ eToken }: tokenProps) {
  const Auth = new AuthService();

  const sendToken = async (token: string) => {
    // Handler to send the email verification link

    // if there is no token, never mind
    if (!token) return;
    const response = await axios
      .get("/api/email/validate-code", {
        params: { eToken },
      })
      .then(() => {
        // direct to the appopriate location
        window.location.assign(Auth.loggedIn() ? "/" : "/#/login");
      })
      .catch((err: AxiosError) => {
        const e: any = err.response?.data;
        for (const prop in e) {
          if (prop === "message") console.log(e[prop]);
        }
      });
  };

  if (eToken) sendToken(eToken);

  return null;
}
