import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ResponsiveSlider from '@/components/Slider/ResponsiveSlider';
import { useI18n } from '@/utils/hooks/useI18n';

export interface WybierzHvytItem {
    id?: number;
    src: string;
    mobileSrc?: string;
    alt: string;
}

export interface WybierzHvytProps {
    /** Provide at least 4 images */
    items: WybierzHvytItem[];
    /** If true, triggers simple motion when the section enters view */
    useInViewTrigger?: boolean;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
    return (node: T) => {
        refs.forEach((ref) => {
            if (!ref) return;
            if (typeof ref === 'function') {
                ref(node);
            } else {
                (ref as React.MutableRefObject<T | null>).current = node;
            }
        });
    };
}

const maskVariants = {
    initial: { clipPath: 'inset(50% 0 0 0 round 16px)', y: 0 },
    animate: {
        clipPath: [
            'inset(50% 0 0 0 round 16px)',
            'inset(0 0 0 0 round 16px)',
            'inset(0 0 50% 0 round 16px)',
        ],
        y: [0, 0, 0],
        transition: { duration: 2, times: [0, 0.5, 1] },
    },
};

const imageVariants = {
    initial: { top: '0%' },
    animate: {
        top: ['0%', '0%', '-50%'],
        transition: { duration: 2, times: [0, 0.5, 1] },
    },
};

const WybierzHvyt: React.FC<WybierzHvytProps> = ({ items, useInViewTrigger = false }) => {
    const {t, getPath} = useI18n();
    const sectionRef = useRef<HTMLElement | null>(null);
    const { ref: inViewRef, inView } = useInView({ threshold: 1, triggerOnce: true });
    const combinedRef = mergeRefs(sectionRef, inViewRef);

    if (!items || items.length < 4) {
        return <p>{t.index.addAtLeast4Images}</p>;
    }

    const animationTrigger = useInViewTrigger ? inView : false;
    const sectionStyle = animationTrigger ? { marginTop: '200px' } : {};

    return (
        <section
            ref={combinedRef}
            style={sectionStyle}
            className="container px-4 md:px-4 lg:px-4 2xl:px-0 mx-auto max-w-grid-desktop mt-0 py-16"
        >
            {/* Mobile View */}
            <div className="px-[16px] flex flex-col items-start mb-8 md:hidden">
                <h2 className="font-size-h2 font-bold text-neutral-darkest">{t.index.choose}<br />{t.index.your} HVYT</h2>
                <p className="font-size-text-medium text-neutral-darkest mt-2">
                    {t.index.chooseSloganMobile}
                </p>
                <div className="mt-4 flex gap-3 flex-wrap">
                    <Link
                        href={getPath('/kategoria/uchwyty-meblowe')}
                        className="px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
                    >
                        {t.index.seeHandles}
                    </Link>
                    <Link
                        href={getPath('/kategoria/uchwyty-meblowe?pa_rodzaj=galki&pa_rodzaj=t-bary')}
                        className="px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
                    >
                        {t.index.seeKnobs}
                    </Link>
                </div>
            </div>

            <div className="md:hidden">
                <ResponsiveSlider
                    items={items.map((item) => ({ src: item.mobileSrc || item.src, alt: item.alt }))}
                    renderItem={(item: { src: string; alt: string; title?: string }) => (
                        <div className="relative w-full h-[300px]">
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
                                className="rounded-[16px]"
                            />
                            {item.title && (
                                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full font-bold text-neutral-darkest">
                                    {item.title}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex gap-6">
                {/* Left Column */}
                <div className="relative w-1/2" style={{ height: '642px' }}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="flex gap-6 h-full">
                            {/* First Left Image */}
                            <div className="w-full relative overflow-hidden h-full rounded-[16px]">
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ borderRadius: '16px' }}
                                    variants={maskVariants}
                                    initial="initial"
                                    animate={animationTrigger ? 'animate' : 'initial'}
                                >
                                    <motion.div
                                        className="absolute"
                                        style={{ left: 0, right: 0, bottom: 0, height: '642px', borderRadius: '16px' }}
                                        variants={imageVariants}
                                        initial="initial"
                                        animate={animationTrigger ? 'animate' : 'initial'}
                                    >
                                        <Image
                                            src={items[0].src}
                                            alt={items[0].alt}
                                            fill
                                            style={{ objectFit: 'contain', objectPosition: 'bottom' }}
                                            className="rounded-[16px] bg-white"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>
                            {/* Second Left Image */}
                            <div className="w-full relative overflow-hidden h-full rounded-[16px]">
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ borderRadius: '16px' }}
                                    variants={maskVariants}
                                    initial="initial"
                                    animate={animationTrigger ? 'animate' : 'initial'}
                                >
                                    <motion.div
                                        className="absolute"
                                        style={{ left: 0, right: 0, bottom: 0, height: '642px', borderRadius: '16px' }}
                                        variants={imageVariants}
                                        initial="initial"
                                        animate={animationTrigger ? 'animate' : 'initial'}
                                    >
                                        <Image
                                            src={items[1].src}
                                            alt={items[1].alt}
                                            fill
                                            style={{ objectFit: 'contain', objectPosition: 'bottom' }}
                                            className="rounded-[16px] bg-white"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    {/* Title Block – overlaps the images */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={animationTrigger ? { y: -300 } : { y: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute z-20 left-0 p-4"
                    >
                        <h2 className="font-size-h2 font-bold text-neutral-darkest">
                            {t.index.chooseHVYT}
                        </h2>
                        <p className="font-size-text-medium mt-[10px] text-neutral-darkest">
                            {t.index.chooseSloganMobile}
                        </p>
                        <div className="mt-[40px] flex gap-3 flex-wrap">
                            <Link
                                href={getPath('/kategoria/uchwyty-meblowe')}
                                className="inline-block px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
                            >
                                {t.index.seeHandles}
                            </Link>
                            <Link
                                href={getPath('/kategoria/uchwyty-meblowe?pa_rodzaj=galki&pa_rodzaj=t-bary')}
                                className="inline-block px-6 py-3 text-lg font-light border border-black rounded-full hover:bg-dark-pastel-red hover:text-neutral-white transition-all"
                            >
                                {t.index.seeKnobs}
                            </Link>
                        </div>
                    </motion.div>
                </div>
                {/* Right Column – static images */}
                <div className="flex flex-col w-1/2">
                    <div className="flex gap-6 h-full">
                        <div className="w-full h-full">
                            <Image
                                src={items[2].src}
                                alt={items[2].alt}
                                width={322}
                                height={642}
                                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-[16px]"
                            />
                        </div>
                        <div className="w-full h-full">
                            <Image
                                src={items[3].src}
                                alt={items[3].alt}
                                width={322}
                                height={642}
                                className="w-full md:w-[322px] md:h-[642px] h-[245px] object-cover rounded-[16px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WybierzHvyt;
