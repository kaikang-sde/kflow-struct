import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { getLoginWithPassword } from "../../api/user";
import { useMutation } from "@tanstack/react-query";
import { useStoreAuth } from "../../hooks";

interface LoginFormInputs {
    phone: string;
    password: string;
}

export default function AccountLoginForm() {
    const { login } = useStoreAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const onSubmit = (data: LoginFormInputs) => {
        console.log("Login Data:", data);
        execLogin(data);
    };

    const { mutate: execLogin, isPending: loadingWithLogin } = useMutation({
        mutationFn: getLoginWithPassword,
        onSuccess: ({ data }) => {
          login(data) // login after login successfully
        },
      });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                {...register("phone", {
                    required: "Phone is required!",
                    pattern: {
                        value: /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                        message: "Invalid US phone number format",
                    },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
            />

            <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                {...register("password", { required: "Password is required!" })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loadingWithLogin}>
                Login
            </Button>
        </Box>
    );
}