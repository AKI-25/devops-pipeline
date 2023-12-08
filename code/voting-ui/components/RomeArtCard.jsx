import Image from 'next/image'
const RomeArtCard = () => {
    return(
    <div className="absolute w-[350px] h-[475px] top-28 ">
            <div className="w-full h-[50px] text-center leading-[50px] text-[20px] font-bold bg-gradient-to-r from-yellow-900 via-yellow-600 via-amber-600 via-yellow-500 via-amber-600 via-yellow-600 to-yellow-900">
                Rome On Fire
            </div>
            <div className="w-full h-[425px]">
            <Image src="/rome.png" width={350} alt='art card' height={425}/>
            </div>
        </div>
    )
}
export default RomeArtCard;