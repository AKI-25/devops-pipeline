import Image from 'next/image'
import { useState } from 'react'
const Display = ({visibility, freezeSwitching, handleVoting}) => {
    const [vote, setVote] = useState("Vote for this art.")
    const handleMouseEnter = () => {
        freezeSwitching(true);
      };
    
      const handleMouseLeave = () => {
        if(vote != "You have voted for this art!"){
            freezeSwitching(false);
        }
      };
      const handleClick = () => {
        setVote("You have voted for this art!")
        handleVoting(true);
        freezeSwitching(true);
      }
    return(
        <div className='h-[225px] w-[450px] absolute bottom-10 right-36'>
            <div className='absolute z-0 top-0 left-0'>
                <Image className='backdrop-blur-md' alt='display panel background' src="/display-bg.png" width={450} height={225} />
            </div>
            <div className='relative z-10'>
                <div className='p-[25px]'>
                <h2 className='text-20 font-bold'>Published by</h2>
                <h3 className={`text-20 font-bold text-violet-800 transition-all ease-in-out duration-500  ${visibility ? 'opacity-0 h-0' : ''}`}>Han1b4l</h3>
                <h3 className={`text-20 font-bold text-violet-800 transition-all ease-in-out duration-500  ${visibility ? '' : 'opacity-0 h-0'}`}>Zeus478</h3>
                <p className={` ${visibility ? 'opacity-0 h-0' : ''}`}>A mesmerizing digital art about Grecian cliff, where an ancient citadel proudly stands, overlooking the endless expanse of the sea</p>
                <p className={` ${visibility ? '' : 'opacity-0 h-0'}`}>Step into a mesmerizing digital realm where the ancient glory of Rome stands ablaze in a breathtaking representation of historical chaos.</p>
                </div>
                <button className='w-[480px] flex items-center justify-center relative -ml-2 mt-8 bottom-0 left-0' onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Image className="absolute" alt='button background' src="/display-button.png" width={425} height={45} />
                    <span>{vote}</span>
                </button>
            </div>
        </div>
    )
}
export default Display;