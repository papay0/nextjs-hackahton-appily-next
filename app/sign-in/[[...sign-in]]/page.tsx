import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignIn appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg rounded-lg border bg-card",
          headerTitle: "text-xl font-bold",
          headerSubtitle: "text-muted-foreground",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          footerAction: "text-sm text-muted-foreground",
          formFieldInput: "bg-background border-input focus:ring-0 focus:ring-offset-0 focus:border-primary",
        }
      }} />
    </div>
  )
} 