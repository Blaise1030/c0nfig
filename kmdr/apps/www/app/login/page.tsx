'use client'
import { Github } from "@/components/icons/Github"
import { Logo } from "@/components/navbar"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { createAuthClient } from "better-auth/client"
import { useState } from "react"
import { Discord } from "@/components/icons/Discord"
import { Twitter } from "@/components/icons/Twitter"

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export const containerClassName = "w-full h-full p-4 lg:p-0"

const client = createAuthClient()

const signin = async (provider: 'discord' | 'github') => {
  const data = await client.signIn.social({ provider: provider })
}

export default function LoginPage() {
  const [hasSignedUp, setHasSignedUp] = useState(false)

  return (
    <div className="w-full flex items-center min-h-screen bg-background">
      <div className="fixed inset-5">
        <Logo />
      </div>
      <div className="flex min-h-dvh flex-1 md:flex-[0.7] items-center justify-center py-12">
        <div className="mx-auto grid gap-6 md:max-w-md max-w-xs w-full p-2 relative">
          <div className="grid text-center">
            <span className="text-3xl font-bold flex-wrap justify-center flex gap-2">
              {hasSignedUp ? <>Hi, welcome to <span className="text-md font-bold font-code">c0nfig.</span></> : "Create your free account"}
            </span>
            <span className="text-balance text-muted-foreground">
              {hasSignedUp ? 'Already have an account ?' : "Don't have an account?"}
              <Button className="p-0 mx-2" variant={'link'} onClick={() => setHasSignedUp(p => !p)}>
                {hasSignedUp ? 'Sign In' : "Sign Up"}
              </Button>
            </span>
          </div>
          <div className="grid gap-4 max-w-xs mx-auto w-full">
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
                return <Button key={id} className="w-full" variant={primary ? 'default' : 'secondary'} onClick={() => signin(id as any)}>
                  {icon}
                  {name}
                </Button>
              })
            }
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex flex-1 h-full min-h-dvh relative">
        <AuroraBackground className="absolute inset-0 min-h-dvh w-full">
          <h1 className="text-center text-muted-foreground text-2xl font-semibold max-w-md">
            Join over 100k developers develop faster with <span className="text-md font-bold font-code">c0nfig.</span>
          </h1>
        </AuroraBackground>
        {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div >
  )
}