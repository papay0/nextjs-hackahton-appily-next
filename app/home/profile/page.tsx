"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { getUserProfile, updateUserProfile, createUserProfile, type User } from "@/lib/user"
import { useFirebaseAuth } from "@/lib/firebase-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { firebaseUser, isFirebaseLoading, firebaseError } = useFirebaseAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    displayName: user?.fullName || user?.username || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    bio: ""
  })

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded || !user) {
        console.log("User not loaded yet")
        return
      }
      
      // Wait until Firebase auth is ready
      if (isFirebaseLoading) {
        console.log("Firebase auth is still loading...")
        return
      }
      
      // Check for Firebase authentication errors
      if (firebaseError) {
        console.error("Firebase auth error:", firebaseError)
        setError(`Firebase authentication failed: ${firebaseError.message}`)
        setIsLoading(false)
        return
      }
      
      // Make sure user is authenticated with Firebase
      if (!firebaseUser) {
        console.log("Firebase user is null, authentication required")
        setError("You need to be authenticated with Firebase to access your profile.")
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      try {
        // Try to get existing profile
        let userProfile = await getUserProfile(user.id)
        
        // If no profile exists, create one with Clerk data
        if (!userProfile) {
          userProfile = await createUserProfile({
            id: user.id,
            displayName: user.fullName || user.username || "",
            email: user.emailAddresses?.[0]?.emailAddress || "",
            photoURL: user.imageUrl || "",
          })
        }
        
        setProfile(userProfile)
        // Initialize form with profile data (prioritize Firebase data if available, fall back to Clerk data)
        setFormData({
          displayName: userProfile.displayName || user.fullName || user.username || "",
          email: userProfile.email || user.emailAddresses?.[0]?.emailAddress || "",
          bio: userProfile.bio || ""
        })
      } catch (error) {
        console.error("Error loading profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProfile()
  }, [user, isLoaded, firebaseUser, isFirebaseLoading, firebaseError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !firebaseUser) {
      toast.error("You need to be authenticated to update your profile", {
        style: {
          borderLeft: '4px solid #ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      })
      return
    }
    
    setIsSaving(true)
    try {
      const updatedProfile = await updateUserProfile(user.id, {
        displayName: formData.displayName,
        email: formData.email,
        bio: formData.bio
      })
      
      setProfile(updatedProfile)
      toast.success("Profile updated successfully", {
        style: {
          borderLeft: '4px solid #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile", {
        style: {
          borderLeft: '4px solid #ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded || isLoading || isFirebaseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div 
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 -z-10"></div>
          </div>
          <p className="text-muted-foreground">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <p>You need to be signed in to view your profile</p>
        </div>
      </div>
    )
  }
  
  if (error || firebaseError) {
    return (
      <div className="container py-10 max-w-3xl">
        <div className="space-y-8">
          <div className="space-y-2">
            <motion.h1 
              className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Profile
            </motion.h1>
          </div>
          
          <Card className="border border-red-200/60 dark:border-red-800/60 bg-background/80 backdrop-blur-md shadow-md">
            <CardHeader>
              <CardTitle className="text-red-500">Authentication Error</CardTitle>
              <CardDescription>
                There was a problem authenticating with Firebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{error || firebaseError?.message || "Unknown authentication error"}</p>

            </CardContent>
            <CardFooter className="pt-6">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <motion.h1 
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Profile
          </motion.h1>
          <p className="text-muted-foreground">
            Manage your personal information and profile settings
          </p>
        </div>
        
        <div className="grid gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
          <Card className="overflow-hidden border border-blue-200/60 dark:border-blue-800/60 bg-background/80 backdrop-blur-md shadow-md">
            <CardHeader className="pb-6 pt-8">
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-blue-500/20">
                  {user.imageUrl ? (
                    <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-sky-500 text-white">
                      {user.fullName?.[0] || user.username?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-1 text-center sm:text-left">
                  <h2 className="text-2xl font-semibold">
                    {profile?.displayName || user.fullName || user.username || "User"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {profile?.email || user.emailAddresses?.[0]?.emailAddress || ""}
                  </p>
                </div>
              </div>
              <CardDescription className="mt-2 text-center sm:text-left">
                {profile?.bio || "No bio provided. Edit your profile to add one."}
              </CardDescription>
            </CardHeader>
          </Card>
          </motion.div>

          {/* Edit Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
          <Card className="border border-blue-200/60 dark:border-blue-800/60 bg-background/80 backdrop-blur-md shadow-md">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="Your name"
                    value={formData.displayName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Note: This doesn&lsquo;t change your account email, just how it appears on your profile
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
