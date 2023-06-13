import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAuth,
    fetchRegistr,
    selectedIsAuth,
} from "../../redux/slices/auth";
import { useForm } from "react-hook-form";

export const Registration = () => {
    const isAuth = useSelector(selectedIsAuth);

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            fullName: "Юзер",
            email: "user@mail.ru",
            password: "1234567",
        },
        mode: "onChange",
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegistr(values));

        // if (!data.payload) {
        //     return alert("Не удалось авторизоваться");
        // }
        // if ("token" in data.payload) {
        //     window.localStorage.setItem("token", data.payload.token);
        // }
    };

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="Полное имя"
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    type="name"
                    {...register("fullName", { required: "Укажите ваше имя" })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    // 2:52
                    helperText={errors.email?.message}
                    type="email"
                    // регистрируем форму и делаем валидацию
                    {...register("email", { required: "Укажите почту" })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    fullWidth
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register("password", { required: "Укажите пароль" })}
                />
                <Button
                    disabled={!isValid}
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
