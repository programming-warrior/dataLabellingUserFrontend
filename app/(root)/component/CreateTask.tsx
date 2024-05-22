"use client";
import RenderImage from "./RenderImage";
import UploadImage from "./UploadImage";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useRouter } from "next/navigation";
import { PublicKey,SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const CreateTask = () => {
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState<string[]>([]);
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [txSignature,setTxSignature]=useState<string|null>(null);
    const {publicKey,sendTransaction}=useWallet();
    const {connection}=useConnection();
    const[processing,setProcessing]=useState(false);



    async function makePayment(){
        if(!publicKey) return;
        const transaction=new Transaction().add(
            SystemProgram.transfer({
                fromPubkey:publicKey,
                toPubkey: new PublicKey("CUQWET53K6d51L8XnQ4L1HQb3ZUZ5xNSFafaXjoXofzB"),
                lamports:10000000,
            })
        )

        const {context,value}=await connection.getLatestBlockhashAndContext();
        const {blockhash,lastValidBlockHeight} =value;
        const signature=await sendTransaction(transaction,connection);
        
        console.log(signature);
        setProcessing(true);

        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature
        });
        setProcessing(false);
        setTxSignature(signature);
    }

    useEffect(()=>{
        console.log(txSignature);
    },[txSignature])

    

    const sendTask = async () => {

        if (disabled) return;
        setDisabled(true);

        try {
            const res = await axios({
                method: 'POST',
                url: `${BACKEND_URL}/v1/user/task`,
                data: JSON.stringify({
                    title,
                    options: imageSrc.map(img => {
                        return { image_url: img }
                    }),
                    signature: txSignature,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTY5NTI4Mn0.77hC31J9fojMUg-7ImJIIqFw_VWgETsqkxMdLFMgtLw'
                }
            })
            setDisabled(false);
            router.push(`/task/${res.data.id}`);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setDisabled(false);
        }
    }

    const sendApiCall = async (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", "yusuf");
            setLoading(true);

            try {

                const res = await axios({
                    method: 'POST',
                    url: "http://localhost:8000/v1/user/uploads",
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTY5NTI4Mn0.77hC31J9fojMUg-7ImJIIqFw_VWgETsqkxMdLFMgtLw'
                    }
                })
                let resFile = `${BACKEND_URL}/static/` + res.data.file;
                setImageSrc([...imageSrc, resFile]);
            }
            catch (e) {
                console.log(e);
            }
            finally {
                setLoading(false);
            }

        }

    }


    useEffect(() => {
        console.log(imageSrc)
    }, [imageSrc])

    return (
        <div className="mt-8 w-3/4 flex flex-col mx-auto">
            <h1 className="text-2xl font-bold text-center">Create a task</h1>
            <div  className="flex flex-col justify-center" onSubmit={(e) => { sendTask(e) }}>
                <div className="flex  justify-between items-center w-1/2 mx-auto p-4   ">
                    <label htmlFor="first_name" className=" mr-4  text-lg block mb-2  font-medium text-gray-900 dark:text-white">Title</label>
                    <input type="text" id="first_name" onChange={(e) => setTitle(e.target.value)} className="flex-1  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="title" required />
                </div>
                <RenderImage src={imageSrc} />
                <UploadImage sendApiCall={sendApiCall} loading={loading} />
                <button onClick={!processing && txSignature?sendTask:makePayment} className={` my-2 mx-auto  text-white ${disabled ? "bg-gray-600" : " bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"} font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}> {txSignature?"submit task":"Pay 0.1 sol"}</button>
            </div>

        </div>
    )
}
export default CreateTask;