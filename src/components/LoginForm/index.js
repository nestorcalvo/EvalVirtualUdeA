import React from "react";
import { MiniLoader } from "../MiniLoader";
import { useInputValue } from "../Forms/Input/useInputValue";
import { Input } from "../Forms/Input";
import {
  LoginError,
  FormWrapper,
  LoginButton,
  Title,
  LoadingMessage,
} from "./styles";
import httpClient from "../../httpClient/httpClient";

import axios from "axios";

export const LoginForm = ({ onSubmit, title, error, loading }) => {
  // const { isFormValid } = useForm()

  const password = useInputValue({
    value: "",
    name: "password",
    type: "password",
    placeholder: "Ingrese su contraseña",
    inputmode: "numeric",
  });
  const identification = useInputValue({
    value: "",
    name: "identificacion",
    type: "number",
    placeholder: "Ingrese su usuario porfavor",
  });

  const verifyForm = async (e) => {
    e.preventDefault();
    if (identification.value === "" || password.value === "") {
      fillError();
    } else {
      console.log("Password type check: ", typeof password.value);
      onSubmit({
        identification: identification.value,
        password: password.value,
      });
    }
  };

  const fillError = () => {
    return (
      <LoginError>
        <span>{error}</span>
      </LoginError>
    );
  };
  const fillContent = () => {
    if (loading) {
      return (
        <LoadingMessage>
          <p>Ingresando</p>
          <MiniLoader />
        </LoadingMessage>
      );
    }
    // return <>
    return (
      <>
        <Title>{title}</Title>
        <form disabled={loading} onSubmit={verifyForm}>
          <Input disabled={loading} {...identification} />
          <Input disabled={loading} {...password} />
          <LoginButton disabled={loading}>Iniciar sesión</LoginButton>
        </form>
      </>
    );
    {
      /* </> */
    }
  };

  return (
    <FormWrapper>
      {fillContent()}
      {error && fillError()}
    </FormWrapper>
  );
};
