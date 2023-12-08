import Image from 'next/image'
import Display from '@/components/Display'
import RomeArtCard from '@/components/RomeArtCard'
import AthenaArtCard from '@/components/AthenaArtCard'
import { useState, useEffect } from 'react'


export default function Home() {
  const [visibility, setVisibility] = useState(true)
  const [isFrozen, setIsFrozen] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [vote, setVote] = useState("");
  const romeGradient = "from-yellow-900 via-yellow-600 via-amber-600 via-yellow-500 via-amber-600 via-yellow-600 to-yellow-900"
  const athenaGradient = "from-teal-700 via-teal-600 via-teal-500 via-teal-400 via-teal-500 via-teal-600 to-teal-700"
  const freezeSwitching = (freeze) => {
    setIsFrozen(freeze);
  };
  const registerVote = async (vote) => {
    try {
      console.log("try")
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vote),
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error('Voting failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleVoting = async (isVoted) => {
    setIsVoted(isVoted);
    if (!visibility) {
      setVote("Athena");
      await registerVote("Athena");
    }
    else {
      setVote("Rome")
      await registerVote("Rome");
    }


  }
  const toggleVisibility = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isFrozen) {
        toggleVisibility();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isFrozen]);
  return (
    <main className=' p-[50px]'>
      <div className='opacity-80'>
        <div className='absolute top-0 left-0 level-1'>
          <Image src="/tl-gr.png" alt='decorative element' width={959} height={959} />
        </div>
        <div className='absolute top-0 left-0 level-1'>
          <Image src="/ml-gr.png" alt='decorative element' width={1552} height={1552} />
        </div>
        <div className='absolute top-0 -right-48 level-1'>
          <Image src="/tr-gr.png" alt='decorative element' width={1687} height={1687} />
        </div>
        <div className='absolute bottom-0 right-0 level-1'>
          <Image src="/br-gr.png" alt='decorative element' width={1509} height={1509} />
        </div>
        <div className={`absolute z-0 top-0 left-0 level-0 transition-all ease-in-out duration-500 ${visibility ? 'opacity-0' : ''}`}>
          <Image src="/athena-bg.png" alt='athena background' width={1920} height={950} />
        </div>
        <div className={`absolute z-0 top-0 left-0 level-0 transition-all ease-in-out duration-500 ${visibility ? '' : 'opacity-0'}`}>
          <Image src="/rome-bg.png" alt='rome background' width={1920} height={950} />
        </div>
      </div>
      <header className='flex justify-between items-center relative level-3'>
        <div>
          <Image src="/logo.png" alt='digart logo' width={180} height={100} />
        </div>
        <div>
          <Image src="/separator.png" alt='separator' width={1300} height={100} />
        </div>
        <ul className='flex gap-[30px]'>
          <li className='text-[24px] font-bold underline underline-offset-8'>
            vote
          </li>
          <li className='text-[24px] font-semibold'>
            result
          </li>
        </ul>
      </header>
      <div className='h-[700px] flex pl-[100px] relative level-2'>
        <div className='w-3/5 h-full flex flex-col justify-center'>
          <h1 className={`text-[64px] font-bold mb-10 transition-opacity ease-in-out duration-500 ${isVoted ? 'opacity-0 h-0' : ''}`}>
            Immerse Yourself in Creativity: <span className='bg-gradient-to-r from-teal-300 to-teal-700 bg-clip-text text-transparent'>Explore, Vote, Engage!</span>
          </h1>
          <h1 className={`text-[64px] font-bold mb-10 transition-opacity ease-in-out duration-500 ${isVoted ? '' : 'opacity-0 h-0'}`}>
            Congratulations! You have voted for <span className={`bg-gradient-to-r bg-clip-text text-transparent ${visibility ? romeGradient : athenaGradient}`}>{`${visibility ? 'Rome On Fire' : 'Athena Heaven'}`}</span>
          </h1>
          <p className={`text-[32px] font-medium text-white/75 w-4/5 transition-opacity ease-in-out duration-500 ${isVoted ? 'opacity-0 h-0' : ''}`}>
            Unveil a gallery of awe-inspiring digital artworks, each a testament to the diverse tapestry of artistic expression. Your journey begins here—immerse yourself in the brilliance, marvel at the intricacies, and let the vibrant hues of creativity captivate your senses.
          </p>
          <p className={`text-[32px] font-medium text-white/75 w-4/5 transition-opacity ease-in-out duration-500 ${isVoted ? '' : 'opacity-0 h-0'}`}>
            Congratulations! Thank you for participating in the DigArt annual Competition by casting your valuable vote for your favorite piece.
            <br />
            To stay updated on the competition and witness the live results as they unfold, make sure to visit the &quot;Results&quot; tab on our platform.
          </p>
        </div>
        <div className="w-2/5 relative flex  items-center">
          <div>
            <div className={`transition-all ease-in-out duration-500 ${visibility ? 'opacity-0' : ''}`}>
              <AthenaArtCard />
            </div>
            <div className={`transition-all ease-in-out duration-500 ${visibility ? '' : 'opacity-0'}`}>
              <RomeArtCard />
            </div>
          </div>
          <Display handleVoting={handleVoting} freezeSwitching={freezeSwitching} visibility={visibility} />
        </div>
      </div>
    </main>
  )
}
