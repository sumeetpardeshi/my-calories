'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, ListChecks, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: <Calculator className="w-12 h-12 text-primary" />,
    title: "Calorie Calculator",
    description: "Easily calculate your daily calorie needs based on your goals and activity level."
  },
  {
    icon: <ListChecks className="w-12 h-12 text-primary" />,
    title: "Food Logging",
    description: "Log your meals and snacks with our extensive food database and barcode scanner."
  },
  {
    icon: <TrendingUp className="w-12 h-12 text-primary" />,
    title: "Progress Tracking",
    description: "Monitor your weight, measurements, and nutritional intake over time with detailed charts."
  }
]

export function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (api) {
      timer = setInterval(() => {
        api.scrollNext()
      }, 5000)
    }
    return () => clearInterval(timer)
  }, [api])

  const handleDotClick = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index)
    }
  }, [api])

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Carousel
        className="w-full"
        setApi={(api) => {
          setApi(api)
          api?.on('select', () => {
            setCurrentIndex(api.selectedScrollSnap())
          })
        }}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="-ml-1">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="pl-1 transition-all duration-300 ease-in-out">
              <Card className="bg-card w-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex flex-col items-center w-full"
                    >
                      {feature.icon}
                      <h3 className="mt-4 text-xl font-semibold text-primary">{feature.title}</h3>
                      <p className="mt-2 text-muted-foreground">{feature.description}</p>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
      <div className="flex justify-center mt-4">
        {features.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-1 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}