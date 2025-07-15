import { useForm, Controller, FormProvider } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import VerificationCodeForm from "../register/VerificationCodeForm";
import { useMutation } from "@tanstack/react-query";
import { getLoginWithCode } from "../../api/user";
import { useStoreAuth } from "../../hooks";

interface CodeLoginFormInputs {
    phone: string;
    captcha: string;
    smsCode: string;
}

export default function CodeLoginForm() {
    const { login } = useStoreAuth();
    const methods = useForm<CodeLoginFormInputs>();
    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = (data: CodeLoginFormInputs) => {
        console.log("Login Data:", data);
        execLogin(data);
    };

    const { mutate: execLogin, isPending: loadingWithLogin } = useMutation({
        mutationFn: getLoginWithCode,
        onSuccess: ({ data }) => {
            login(data) // login after login successfully
        },
    });

    return (
        <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Controller
                    name="phone"
                    rules={{
                        required: "Phone is required!",
                        pattern: {
                            value: /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                            message: "Invalid US phone number format",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Phone"
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    )}
                />

                <VerificationCodeForm type="login" />

                <Button type="submit" variant="contained" fullWidth disabled={loadingWithLogin}>
                    Login
                </Button>
            </Box>
        </FormProvider>
    );
}