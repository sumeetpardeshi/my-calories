"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Camera, Calendar as CalendarIcon, Trophy, Settings, LogOut, Menu, BarChart, HandPlatter } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LogItem from '@/components/log-item/log-item'
// Mock functions (unchanged)
const analyzeImage = async (imageUrl: string) => {
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
   
    //if (!response.ok) {
    //  throw new Error('Failed to analyze image');
    //}

    const data = await response.json();
    console.log("data",data);
    // if (!data.items || !Array.isArray(data.items)) {
    //   throw new Error('Invalid response format');
    // }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
}

const getUserData = () => {
  const storedData = localStorage.getItem('userData')
  return storedData ? JSON.parse(storedData) : null
}

const saveUserData = (data: any) => {
  localStorage.setItem('userData', JSON.stringify(data))
}

export function MyCaloriesAppComponent() {
  const [user, setUser] = useState<any>(null)
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>({"calorie_estimation":[{"item":"Romaine lettuce (2 cups)","calories":16},{"item":"Cherry tomatoes (1/2 cup)","calories":15},{"item":"Cucumber (1/2 medium)","calories":8},{"item":"Grilled chicken breast (3 oz)","calories":128},{"item":"Hard-boiled egg (1 large)","calories":78},{"item":"Cheddar cheese (1 oz)","calories":113},{"item":"Ranch dressing (2 tbsp)","calories":145}],"total_calories":503,"suggested_when_to_eat":"This meal is great for lunch or a light dinner.","modifications":[{"snackType":"Add-ons","add":"Add more vegetables like bell peppers","remove":"Remove ranch dressing for a lighter option"}],"tags":["healthy","high-protein","low-carb"],"potential_allergies":["dairy","egg"]})
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeSection, setActiveSection] = useState<string>('log')

  useEffect(() => {
    const userData = getUserData()
    if (userData) {
      setUser(userData)
    }
  }, [])

  useEffect(()=> {
    console.log("analysis state", analysis)
  }, [analysis])

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const userData = {
      name: formData.get('name') as string,
      height: Number(formData.get('height')),
      weight: Number(formData.get('weight')),
      age: Number(formData.get('age')),
    }
    setUser(userData)
    saveUserData(userData)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImageUpload")
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageAnalysis = async () => {
    if (!image) return
    try {
      setError(null)
      const result = await analyzeImage(image)
      console.log("set result after handleImageAnalysis", result)
      setAnalysis(result)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'log':
        return (
          <LogItem handleImageUpload={handleImageUpload} image={image} error={error} analysis={analysis} handleImageAnalysis={handleImageAnalysis} />
        )
      case 'calendar':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Calorie Log</CardTitle>
              <CardDescription>View your calorie intake over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <div className="mt-4">
                <h3 className="font-semibold">Log for {date?.toDateString()}:</h3>
                <p>Total Calories: 1800</p>
                <ul>
                  <li>Breakfast: 400 calories</li>
                  <li>Lunch: 600 calories</li>
                  <li>Dinner: 800 calories</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )
      case 'stats':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>View your nutrition statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span>Average Daily Calories:</span>
                  <span className="font-semibold">2000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Most Common Cuisine:</span>
                  <span className="font-semibold">Italian</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Healthiest Day:</span>
                  <span className="font-semibold">Wednesdays</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 'leaderboard':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>See how you stack up against other users</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <div key={rank} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">{rank}</span>
                        <Avatar>
                          <AvatarFallback>U{rank}</AvatarFallback>
                        </Avatar>
                        <span>User {rank}</span>
                      </div>
                      <span>{2000 - (rank * 100)} avg. calories</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Your Rank: 17th</p>
            </CardFooter>
          </Card>
        )
      default:
        return null
    }
  }

  if (!user) {
    return (
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>Set Up Your Profile</CardTitle>
          <CardDescription>We need some information to calculate your BMI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" name="height" type="number" placeholder="175" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" placeholder="70" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" placeholder="30" required />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary md:h-8 md:w-8 md:text-base"
          >
            <HandPlatter className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">MyCalories</span>
          </Link>
          <Button
            variant={activeSection === 'log' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9 md:w-8 md:h-8"
            onClick={() => setActiveSection('log')}
          >
            <Camera className="h-5 w-5" />
            <span className="sr-only">Log Food</span>
          </Button>
          <Button
            variant={activeSection === 'calendar' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9 md:w-8 md:h-8"
            onClick={() => setActiveSection('calendar')}
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="sr-only">Calendar</span>
          </Button>
          <Button
            variant={activeSection === 'stats' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9 md:w-8 md:h-8"
            onClick={() => setActiveSection('stats')}
          >
            <BarChart className="h-5 w-5" />
            <span className="sr-only">Stats</span>
          </Button>
          <Button
            variant={activeSection === 'leaderboard' ? 'default' : 'ghost'}
            size="icon"
            className="w-9 h-9 md:w-8 md:h-8"
            onClick={() => setActiveSection('leaderboard')}
          >
            <Trophy className="h-5 w-5" />
            <span className="sr-only">Leaderboard</span>
          </Button>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 md:w-8 md:h-8"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary md:text-base"
                >
                  <HandPlatter className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">MyCalories</span>
                </Link>
                <Button
                  variant={activeSection === 'log' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveSection('log')}
                >
                  <Camera className="h-5 w-5 mr-2"   />
                  Log Food
                </Button>
                <Button
                  variant={activeSection === 'calendar' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveSection('calendar')}
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={activeSection === 'stats' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveSection('stats')}
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  Stats
                </Button>
                <Button
                  variant={activeSection === 'leaderboard' ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveSection('leaderboard')}
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Leaderboard
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-2xl font-bold">MyCalories</h1>
          <div className="ml-auto flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}