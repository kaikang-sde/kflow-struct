import { TextField, FormControlLabel, Checkbox, Button, Typography } from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import VerificationCodeForm from "./VerificationCodeForm";

export default function RegisterForm() {
  const methods = useForm({
    defaultValues: {
      phone: "",
      captcha: "",
      smsCode: "",
      password: "",
      confirm: "",
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

  const onSubmit = (data: any) => {
    console.log("Register", data);
  };

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
          <VerificationCodeForm type="register" />

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
              {...register("confirm", {
                required: "Please enter your confirm password!",
                validate: (value) => value === password || "Confirm password does not match!",
              })}
              error={!!errors.confirm}
              helperText={errors.confirm?.message}
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