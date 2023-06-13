import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectedIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    console.log(id);
    const isAuth = useSelector(selectedIsAuth);
    const [loading, setLoading] = useState(false);
    const [feilds, setFeilds] = useState({
        title: "",
        tags: "",
        imageUrl: "",
    });
    const inputFileRef = useRef(null);

    useEffect(() => {
        if (id) {
            axios
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    const { title, tags, text, imageUrl } = data;
                    setFeilds({ title, tags, text, imageUrl });
                })
                .catch((err) => {
                    console.warn(err);
                    alert("Не удалось получить данные о статьи!");
                });
        }
    }, []);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append("image", file);
            const { data } = await axios.post("/upload", formData);
            setFeilds((prevState) => ({
                ...prevState,
                imageUrl: data.url,
            }));
        } catch (err) {
            console.warn(err);
            alert("Ошибка при загрузке изображения!");
        }
    };

    const onClickRemoveImage = () => {};
    const onChange = React.useCallback((text) => {
        setFeilds((prevState) => ({ ...prevState, text }));
    }, []);

    const onSubmit = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post("/posts", feilds);
            const id = data._id;
            navigate(`/posts/${id}`);
        } catch (error) {
            console.warn(error);
            alert("Не удалось создать статью!");
        }
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: "400px",
            autofocus: true,
            placeholder: "Введите текст...",
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        []
    );

    if (!localStorage.getItem("token") && !isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button
                onClick={() => inputFileRef.current.click()}
                variant="outlined"
                size="large"
            >
                {!isEditing ? "Загрузить превью" : "Обновить превью"}
            </Button>
            <input
                ref={inputFileRef}
                type="file"
                onChange={handleChangeFile}
                hidden
            />
            {feilds.imageUrl && (
                <Button
                    variant="contained"
                    color="error"
                    onClick={onClickRemoveImage}
                >
                    Удалить
                </Button>
            )}
            {feilds.imageUrl && (
                <img
                    className={styles.image}
                    src={`http://localhost:8000${feilds.imageUrl}`}
                    alt="Uploaded"
                />
            )}
            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={feilds.title}
                onChange={(e) =>
                    setFeilds((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                    }))
                }
                fullWidth
            />
            <TextField
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Тэги"
                value={feilds.tags}
                onChange={(e) =>
                    setFeilds((prevState) => ({
                        ...prevState,
                        tags: e.target.value,
                    }))
                }
                fullWidth
            />
            <SimpleMDE
                className={styles.editor}
                value={feilds.text}
                onChange={onChange}
                options={options}
            />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {!isEditing ? "Опубликовать" : "Сохранить"}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
