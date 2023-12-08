import Image from 'next/image'
const AthenaArtCard = () => {
    return(
    <div className="w-[350px] h-[475px]">
            <div className="w-full h-[50px] text-center leading-[50px] text-[20px] font-bold bg-gradient-to-r from-teal-700 via-teal-600 via-teal-500 via-teal-400 via-teal-500 via-teal-600 to-teal-700">
                Athena Heaven
            </div>
            <div className="w-full h-[425px]">
            <Image src="/athena.png" alt='art card' width={350} height={425}/>
            </div>
        </div>
    )
}
export default AthenaArtCard;