import "./ResetPassword.css";
import { useParams } from "react-router-dom";

export function ResetPassword() {
  const params = useParams();
  const eToken = params.eToken;

  return <div>{eToken}</div>;
}
