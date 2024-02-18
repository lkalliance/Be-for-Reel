import "./Contact.css";

import { useState } from "react";
import axios from "axios";
import { validateEmail } from "../../utils/typeUtils";
import { TextAreaField, InputText } from "../../components";

export function Contact() {
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    message: "",
  });
  const [showResult, setShowResult] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setShowResult("");
    const { id, value } = e.currentTarget;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/email/contact-us", {
        email: formValues.email,
        message: formValues.message,
        username: formValues.username || undefined,
      });

      if (response.data.message === "Success.") {
        setFormValues({
          email: "",
          username: "",
          message: "",
        });
        setShowResult("success");
      }
    } catch (err) {
      console.log(err);
      setShowResult("failure");
    }
  };

  return (
    <section id="contact">
      <h1>Contact Be for Reel</h1>
      <p>
        Please fill out the form below to send an email to the owner of this
        website. As this is little more than a project, we offer no guarantee of
        a response to your email.
      </p>
      <InputText
        label="Your email address"
        type="email"
        id="email"
        val={formValues.email}
        setValue={handleChange}
        placeholder="(required)"
      />
      <InputText
        label="Your Be for Reel username"
        type="text"
        id="username"
        val={formValues.username}
        setValue={handleChange}
      />
      <TextAreaField
        label="Your message"
        id="message"
        val={formValues.message}
        setValue={handleChange}
      />
      <button
        className="btn btn-primary"
        disabled={
          validateEmail(formValues.email) || formValues.message.length < 3
        }
        onClick={handleSubmit}
      >
        Send your message
      </button>
      {showResult === "success" && (
        <div className="alert alert-success">Your message has been sent.</div>
      )}
      {showResult === "failure" && (
        <div className="alert alert-danger">
          Your message was not successfully sent. Please try again.
        </div>
      )}
    </section>
  );
}
