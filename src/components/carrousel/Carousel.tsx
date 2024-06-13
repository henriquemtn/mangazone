'use client';

import Image from 'next/image';
import React from 'react';
import Banner from '@/app/assets/banner.png';
import BannerMobile from '@/app/assets/banner-mobile.png';

export default function Carousel() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className='md:mt-4 w-full md:w-[1400px] rounded-xl'>
      <Image src={isMobile ? BannerMobile : Banner} alt='background' layout='responsive' className='rounded-xl' width={1400} height={600} />
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addListener(handler);

    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}
