import LeadForm from '@/components/LeadForm'
import TrackingDebug from '@/components/TrackingDebug'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, Zap, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm">
            ✨ Sistema de Leads Modernizado
          </Badge>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Bem-vindo!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Preencha o formulário abaixo e faça parte do nosso time. 
            Seus dados estão seguros e serão usados apenas para contato.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Features */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  Segurança Garantida
                </CardTitle>
                <CardDescription>
                  Seus dados são protegidos com criptografia de ponta a ponta
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Comunidade Ativa
                </CardTitle>
                <CardDescription>
                  Junte-se a milhares de profissionais que já fazem parte
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Processo Rápido
                </CardTitle>
                <CardDescription>
                  Cadastro simples e resposta em até 24 horas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Validação Instantânea
                </CardTitle>
                <CardDescription>
                  Verificação automática de dados e idade mínima
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <LeadForm />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Seus dados estão seguros conosco e serão usados apenas para contato.
          </p>
        </div>
      </div>
      
      {/* Tracking Debug Component */}
      <TrackingDebug />
    </main>
  )
}


