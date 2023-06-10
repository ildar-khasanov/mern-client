import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";

export const FullPost = () => {
    const [data, setData] = useState();
    const [loading, setIsLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);
    console.log(data);

    if (loading) {
        return <Post isLoading={loading} />;
    }

    return (
        <>
            <Post
                id={1}
                title={data.title}
                imageUrl={data.imageUrl}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={3}
                tags={data.tags}
                isFullPost
            >
                <p>
                    Hey there! 👋 I'm starting a new series called "Roast the
                    Code", where I will share some code, and let YOU roast and
                    improve it. There's not much more to it, just be polite and
                    constructive, this is an exercise so we can all learn
                    together. Now then, head over to the repo and roast as hard
                    as you can!!
                </p>
            </Post>
            <CommentsBlock
                items={[
                    {
                        user: {
                            fullName: "Вася Пупкин",
                            avatarUrl:
                                "https://mui.com/static/images/avatar/1.jpg",
                        },
                        text: "Это тестовый комментарий 555555",
                    },
                    {
                        user: {
                            fullName: "Иван Иванов",
                            avatarUrl:
                                "https://mui.com/static/images/avatar/2.jpg",
                        },
                        text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                    },
                ]}
                isLoading={false}
            >
                <Index />
            </CommentsBlock>
        </>
    );
};
