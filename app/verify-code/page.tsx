'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { verifyOtpService, forgotPasswordService } from '@/lib/auth'

export default function VerifyCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  
  // Refs pour gérer le focus entre les inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Rediriger si pas d'email
  useEffect(() => {
    if (!email) {
      router.push('/forgot-password')
    }
  }, [email, router])

  // Gérer le countdown pour le renvoi
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  // Masquer l'email partiellement
  const maskedEmail = email ? 
    email.replace(/(.{2}).*(@.*)/, '$1***$2') : ''

  // Gérer les changements dans les inputs du code
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Empêcher plus d'un caractère
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')

    // Auto-focus sur l'input suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Gérer les touches spéciales (backspace, paste)
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Gérer le paste d'un code complet
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      setError('')
    }
  }

  // Soumettre le code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    if (!email) return

    setIsLoading(true)
    setError('')

    try {
      const response = await verifyOtpService.verifyCode(email, fullCode)
      
      if (response.success) {
        // Rediriger vers reset-password avec email et code
        router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${fullCode}`)
      } else {
        setError(response.message || 'Invalid verification code')
      }
    } catch (error) {
      setError('Connection error. Please try again')
    } finally {
      setIsLoading(false)
    }
  }

  // Renvoyer le code
  const handleResendCode = async () => {
    if (!email || isResending || resendCountdown > 0) return

    setIsResending(true)
    setError('')

    try {
      const response = await forgotPasswordService.forgotPassword(email)
      
      if (response.success) {
        setResendCountdown(60) // 60 secondes avant de pouvoir renvoyer
        // Réinitialiser le code
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setError(response.message || 'Failed to resend code')
      }
    } catch (error) {
      setError('Connection error. Please try again')
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return null // ou un loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <LoadingOverlay show={isLoading} />
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Code</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            We've sent a 6-digit verification code to:<br />
            <strong>{maskedEmail}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Code Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || code.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending || resendCountdown > 0}
                className="text-sm"
              >
                {isResending ? (
                  'Sending...'
                ) : resendCountdown > 0 ? (
                  `Resend in ${resendCountdown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-muted-foreground"
              >
                ← Back to email entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}