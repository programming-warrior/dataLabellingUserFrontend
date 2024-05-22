"use client";
const UploadImage = ({ sendApiCall, loading }: { sendApiCall: (e: React.ChangeEvent) => void, loading: boolean }) => {
    return (
        <>
            <div className="flex justify-center items-center mt-4">
                <div className=" relative w-40 h-40 border-2  border-gray-400 text-gray-500 rounded-xl flex justify-center items-center text-2xl  font-extrabold">
                    {loading ? "Loading..." : <>
                        +
                    <input type="file" onChange={(e) => sendApiCall(e)} className=" cursor-pointer opacity-0  absolute top-0 h-full w-full left-0" />
                    </>
                    }
                </div>
            </div>
        </>

    )

}

export default UploadImage;