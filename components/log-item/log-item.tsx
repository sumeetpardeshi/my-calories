"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Image from "next/image"
import AnalysisDisplay from "@/components/AnalysisDisplay";

const LogItem = ({handleImageUpload, image, error, analysis, handleImageAnalysis}: {handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void, image: string | null, error: string | null, analysis: {total_calories: number, calorie_estimation: Array<{item: string, calories: number, tags: string[]}>, suggested_when_to_eat: string} | null, handleImageAnalysis: () => void}) => {

  console.log("LogItem",analysis)
  return (
    <div className="space-y-6 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Log Your Food</CardTitle>
          <CardDescription>Upload a photo of your meal to analyze calories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
         
          {image && (
            <div className="mt-4">
              <Image src={image} alt="Uploaded food" width={300} height={300} className="rounded-md" />
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleImageAnalysis} disabled={!image}>Analyze Image</Button>
        </CardFooter>
      </Card>

      {analysis && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Meal Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalysisDisplay analysis={analysis} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LogItem
