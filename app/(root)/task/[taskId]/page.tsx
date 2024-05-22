"use client";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Appbar from "@/app/(root)/component/Appbar";
import RenderImage from "@/app/(root)/component/RenderImage";
import { Result } from "postcss";

export default function Task({ params: { taskId } }: { params: { taskId: string } }) {
    interface taskDetailType {
        [key: string]: {
            count: number,
            option: {
                image_url: string,
            }
        }
    }
    const [taskDetails, setTaskDetails] = useState<taskDetailType>({});
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function () {
            setLoading(true);
            const res = await axios({
                method: "get",
                url: `${BACKEND_URL}/v1/user/task?taskId=${taskId}`,
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTY5NTI4Mn0.77hC31J9fojMUg-7ImJIIqFw_VWgETsqkxMdLFMgtLw'
                }
            })
            setLoading(false);
            setTitle(res.data.title);
            setTaskDetails(res.data.result);
        }())
    }, [])


    useEffect(() => {
        console.log(taskDetails);
    }, [taskDetails])


    if (loading) {
        return <p className="h-screen w-screen flex justify-center items-center">Loading...</p>
    }

    return (
        <div>
            <Appbar />
            <div className="mt-8">
                <h1 className="text-2xl font-bold text-center tracking-wide uppercase">{title}</h1>
                <div className="flex  justify-between items-center w-1/2 mx-auto p-4   ">
                    {
                        Object.keys(taskDetails).map(id => {

                            return (
                                <div className="flex flex-col justify-center items-center">
                                    <img src={taskDetails[id].option.image_url} className="w-64" />
                                    <p className="text-xl text-gray-500">{taskDetails[id]['count']}</p>
                                </div>

                            )
                        })
                    }


                </div>
            </div>

        </div>
    )
}