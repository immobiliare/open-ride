//@ts-check

import { useRouter } from "next/router";
import { useState } from "react";
import { SignUpStep1 } from "./Step1";
import { SignUpStep2 } from "./Step2";
import { SignUpStep3 } from "./Step3";

function signup(data) {
  return fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function SignUp() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(null);

  const router = useRouter();

  async function handleSignup(payload) {
    await signup(payload);

    router.push("/");
  } 

  switch (step) {
    case 1:
      return (
        <SignUpStep1
          onSubmit={(partial) => {
            setData(partial);
            setStep(2);
          }}
        />
      );
    case 2:
      return (
        <SignUpStep2
          onSubmit={(partial) => {
            if (partial.userType === "passenger") {
              handleSignup({
                ...data,
                ...partial,
              });
            } else {
              setData({ ...data, ...partial });
              setStep(3);
            }
          }}
        />
      );
    case 3:
      return (
        <SignUpStep3
          onSubmit={async (partial) => {
            handleSignup({
              ...data,
              ...partial,
            });
          }}
        />
      );
  }
}
