'use client'
import { Github } from "@/components/icons/Github"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Discord } from "@/components/icons/Discord"
import { Twitter } from "@/components/icons/Twitter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/navbar"
import { signin } from "@/be/auth/client"

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export const containerClassName = "w-full h-full p-4 lg:p-0"


export default function LoginPage() {
  const [hasSignedUp, setHasSignedUp] = useState(false)

  return (
    <AuroraBackground>
      <div className="w-full flex items-center min-h-dvh justify-center bg-background">
        <div className="fixed top-4 text-foreground">
          <Logo />
        </div>
        <Card className="z-50 shadow-none bg-transparent border-0 max-w-sm w-full py-3">
          <CardHeader className="text-center items-center flex gap-0 flex-col">
            <CardTitle>{hasSignedUp ? <>Hi, welcome to <span className="text-md font-bold font-code">c0nfig.</span></> : "Create your free account"}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {hasSignedUp ? 'Already have an account ?' : "Don't have an account?"}
              <Button className="p-0 mx-2 h-auto" variant={'link'} onClick={() => setHasSignedUp(p => !p)}>
                {hasSignedUp ? 'Sign In' : "Sign Up"}
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 max-w-xs mx-auto">
            {
              [{
                primary: true,
                name: "Github",
                id: 'github',
                icon: <Github />
              }, {
                primary: false,
                name: "Twitter",
                id: 'twitter',
                icon: <Twitter />
              }, {
                primary: false,
                name: "Discord",
                id: 'discord',
                icon: <Discord />
              }].map(({ id, icon, name, primary }) => {
                return <Button key={id} className="w-full" variant={primary ? 'default' : 'outline'} onClick={() => signin(id as any)}>
                  {icon}
                  {name}
                </Button>
              })
            }
          </CardContent>
        </Card>
      </div >
    </AuroraBackground>

  )
}