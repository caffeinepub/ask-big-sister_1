import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function HomePage() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity && loginStatus === 'success';
  
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/30 to-background py-20 px-4">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/ask-big-sister-hero-bg.dim_1600x900.png)' }}
        />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <img 
              src="/assets/generated/ask-big-sister-logo.dim_512x512.png" 
              alt="Ask Big Sister" 
              className="w-32 h-32 rounded-3xl shadow-lg"
            />
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Ask Big Sister
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                A supportive community where women help each other with questions, advice, and encouragement
              </p>
            </div>
            {isAuthenticated && userProfile && (
              <div className="flex items-center gap-2 px-6 py-3 bg-accent/50 rounded-full">
                <span className="text-sm text-muted-foreground">Welcome back,</span>
                <span className="font-semibold">{userProfile.name}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <MessageCircle className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Ask Questions</CardTitle>
                <CardDescription>
                  Share your questions with a supportive community of women ready to help
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <MessageCircle className="w-12 h-12 mb-4 text-primary ml-6 mt-6" />
              <CardHeader>
                <CardTitle>Give Answers</CardTitle>
                <CardDescription>
                  Share your wisdom and experience to help others on their journey
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Sparkles className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>AI Support</CardTitle>
                <CardDescription>
                  Get thoughtful AI-generated responses when you need quick guidance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Wallet Feature Section */}
      {isAuthenticated && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
                <CardDescription className="text-base">
                  Link your crypto wallet address to your Ask Big Sister profile
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Button 
                  size="lg"
                  onClick={() => navigate({ to: '/connect-wallet' })}
                  className="gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  Manage Wallet Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Join Our Community Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Sign in with Internet Identity to start asking questions and sharing your wisdom
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
