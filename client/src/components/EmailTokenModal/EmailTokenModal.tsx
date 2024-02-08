// This component handles the acceptance of the email confirmation token

/* REQUIRED PROPS:
eToken: the token to be checked
setLogIn: setter for the flag that a user is logged in */

import "./EmailTokenModal.css";
import { Dispatch, SetStateAction } from "react";
import axios, { AxiosError } from "axios";
import { AuthService } from "../../utils/auth";

interface tokenProps {
  eToken: string | undefined;
  setLogIn: Dispatch<SetStateAction<boolean>>;
}

export function EmailTokenModal({ eToken, setLogIn }: tokenProps) {
  const Auth = new AuthService();

  const sendToken = async (token: string) => {
    // Handler to send the email verification link

    // if there is no token, never mind
    if (!token) return;
    await axios
      .get("/api/email/validate-code", {
        params: { eToken },
      })
      .then(() => {
        // log out the user
        Auth.logout();
        setLogIn(false);
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
