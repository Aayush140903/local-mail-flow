import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Shield, Zap, Globe, Users, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6">LocalMail Platform</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            The complete email platform for developers. Send, track, and manage your emails with enterprise-grade reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/auth">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Easy Email Sending</CardTitle>
              <CardDescription className="text-white/80">
                Send emails with our intuitive interface or powerful API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/90">
                <li>• Visual email builder</li>
                <li>• Template management</li>
                <li>• Bulk email sending</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription className="text-white/80">
                Bank-grade security for your email infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/90">
                <li>• End-to-end encryption</li>
                <li>• DKIM & SPF records</li>
                <li>• Advanced authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>High Performance</CardTitle>
              <CardDescription className="text-white/80">
                Lightning-fast delivery with 99.9% uptime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/90">
                <li>• Global infrastructure</li>
                <li>• Real-time tracking</li>
                <li>• Advanced analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Global Reach</CardTitle>
              <CardDescription className="text-white/80">
                Deliver emails worldwide with local infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/90">
                <li>• Multi-region deployment</li>
                <li>• CDN integration</li>
                <li>• Localized delivery</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription className="text-white/80">
                Work together with advanced team features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/90">
                <li>• Role-based access</li>
                <li>• Team workspaces</li>
                <li>• Audit logs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Developer Friendly</CardTitle>
              <CardDescription className="text-white/80">
                Built by developers, for developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/90">
                <li>• RESTful API</li>
                <li>• Webhook support</li>
                <li>• SDK libraries</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-white/80">Uptime Guarantee</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1B+</div>
              <div className="text-white/80">Emails Delivered</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Happy Developers</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-white/10 border-white/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-white/80 mb-6">
                Join thousands of developers who trust LocalMail for their email infrastructure.
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/auth">
                  Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
