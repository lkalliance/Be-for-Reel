import "./EmailTokenModal.css";
import axios from "axios";

interface tokenProps {
  token: string;
}

export function EmailTokenModal({ token }: tokenProps) {
  console.log("In the email token component");
  console.log(token);
  const sendToken = async (token: string) => {
    console.log("In the sendToken function");
    // Handler to send the email verification link

    // if there is no token, never mind
    if (!token) return;
    try {
      console.log("sending the token to the route");
      const response = await axios.get("/api/email/validate-code", {
        params: { token },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  sendToken(token);

  return null;
}
