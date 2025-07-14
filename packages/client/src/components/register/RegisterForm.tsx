import { TextField, FormControlLabel, Checkbox, Button, Typography } from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerificationCodeForm from "./VerificationCodeForm";
import { useMutation } from "@tanstack/react-query";
import { getRegister } from "../../api/user";
import { useStoreAuth } from "../../hooks";
import type { RegisterRequest } from "@kflow-struct/share";
import { useRef } from "react";

type FormData = {
  phone: string;
  captcha: string;
  smsCode: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
};

export default function RegisterForm() {
  const { login } = useStoreAuth();
  // prepare a ref to store a function or null. 
  // This ref will be set to the refreshCaptcha() function in child component VerificationCodeForm, then invoke it in current parent component RegisterForm
  const refreshCaptchaRef = useRef<((params: { type: string }) => void) | null>(null);

  const methods = useForm<FormData>({
    defaultValues: {
      phone: "",
      captcha: "",
      smsCode: "",
      password: "",
      confirmPassword: "",
      remember: false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const password = useWatch({ control, name: "password" });

  const onSubmit = (values: FormData) => {
    const payload: RegisterRequest = {
      phone: values.phone,
      smsCode: values.smsCode,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    execRegister(payload); // payload is the data to be sent to the server
  }

  const { mutate: execRegister, isPending: loadingWithRegister } = useMutation({
    mutationFn: getRegister,
    onSuccess: ({ data }) => {
      login(data) // login after register successfully
    },
    onError: (err: any) => {
      console.error("Failed to register", err.response?.data)
    },
    onSettled: () => {
      // since the child component VerificationCodeForm has set the refreshCaptcha function to the ref.current
      // the parent component can invoke it to refresh captcha
      refreshCaptchaRef.current?.({ type: "register" })
    }
  });

  return (
    <div className="space-y-4">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <TextField
              label="Phone"
              fullWidth
              {...register("phone", { required: "Phone is required!" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </div>

          {/* verification: captcha + smsCode*/}
          {/* pass the ref to child component, VerificationCodeForm, so that child component can set a function to it */}
          <VerificationCodeForm type="register" setRefreshCaptchaRef={refreshCaptchaRef} />

          <div>
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password", { required: "Please enter your password!" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>

          <div>
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              {...register("confirmPassword", {
                required: "Please enter your confirm password!",
                validate: (value) => value === password || "Confirm password does not match!",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  {...register("remember", {
                    validate: (v) => v || "Please agree to the agreement!",
                  })}
                />
              }
              label={
                <Typography variant="body2">
                  Agree to the agreement
                  <span className="text-blue-600 underline cursor-pointer">
                    {" "}
                    Privacy Policy
                  </span>
                </Typography>
              }
            />
            {errors.remember && (
              <p className="text-red-500 text-sm mt-1">{errors.remember.message}</p>
            )}
          </div>

          <Button
            disabled={loadingWithRegister}
            variant="contained"
            type="submit"
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Register
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}