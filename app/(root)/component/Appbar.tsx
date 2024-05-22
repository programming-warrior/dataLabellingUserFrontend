"use client";
import {WalletMultiButton,WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import axios from "axios";
import { BACKEND_URL } from '@/app/config';

const Appbar=()=>{
    const {publicKey,signMessage} =useWallet();
    useEffect(()=>{
        if(!publicKey) return;
        if(!signMessage) return;
        (async function(){
            const message=new TextEncoder().encode("sign in and have some pizza with fizz");
            const signature = await signMessage(message);
            console.log(message);
            console.log(signature);
            console.log(publicKey);
            try{
                const res=await axios.post(`${BACKEND_URL}/v1/user/signin`,{
                    signature,
                    publicKey:publicKey.toString()
                })
                const token=res.data.token; 
                localStorage.setItem('token',token);           
            }
            catch(e){

            }
        
        })()
 
    },[publicKey])
    return(
        <div className="flex w-full  justify-between px-6 items-center py-4 shadow-md">
            <div className="text-xl font-bold uppercase tracking-wide text-slate-950">
                Trixity
            </div>
            <div>
                {
                    publicKey? <WalletDisconnectButton/>: <WalletMultiButton/>
                }
            {/* <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Connect Your Wallet</button> */}
            </div>
        </div>
    )   
}

export default Appbar;