const RenderImage=({src}:{src:string[]})=>{

    return(
        <div className="flex flex-wrap gap-2 justify-around w-3/4  mx-auto p-4">
            {
                src.map((s,i)=>{
                   return(
                    <div>
                        <img src={s} key={i} className="max-w-64  rounded"></img>
                    </div>
                   )
                })
            }
        </div>
    )
}

export default RenderImage;