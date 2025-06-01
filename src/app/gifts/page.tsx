"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Gift,
  CreditCard,
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCircle,
  Banknote,
  Smartphone,
  Building,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function GiftsPage() {
  const [giftForm, setGiftForm] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
    paymentMethod: "opay",
  })
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState("")
  const [showPaymentDetails, setShowPaymentDetails] = useState(true)

  const accountDetails = {
    accountNumber: "9018743148",
    accountName: "Isaac Chidiebube",
    bankName: "OPay",
  }

  const handleSubmitGift = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase.from("gifts").insert([
        {
          name: giftForm.name,
          email: giftForm.email,
          amount: giftForm.amount ? Number.parseFloat(giftForm.amount) : null,
          message: giftForm.message,
          payment_method: giftForm.paymentMethod,
          contact_requested: true,
        },
      ])

      if (error) throw error

      setGiftForm({ name: "", email: "", amount: "", message: "", paymentMethod: "opay" })
      alert("🎉 Gift notification sent successfully! Ritchie will be notified about your generous gift.")
    } catch (error) {
      console.error("Error submitting gift:", error)
      alert("❌ Error submitting gift information. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const whatsappNumber = "+2349079928298" // Replace with actual WhatsApp number
  const whatsappMessage = encodeURIComponent(
    `Hi Ritchie! 🎉 I've sent you a birthday gift of ₦${giftForm.amount || "___"} to your OPay account (${accountDetails.accountNumber}). Happy Birthday! 🎁`,
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 pt-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            Send a Gift
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Show your love and appreciation with a special birthday gift for Ritchie
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Payment Details Section */}
          <div className="space-y-6">
            <Card className="p-6 md:p-8 bg-white/10 backdrop-blur-md border-white/20 smooth-hover">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
                  <Banknote className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Payment Details</h3>
                  <p className="text-gray-300">Send your gift directly to Ritchie's account</p>
                </div>

                {/* Account Details Card */}
                <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300 font-medium">Bank:</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-lg">{accountDetails.bankName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(accountDetails.bankName, "bank")}
                          className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-2"
                        >
                          {copied === "bank" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300 font-medium">Account Number:</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-xl tracking-wider">
                          {accountDetails.accountNumber}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(accountDetails.accountNumber, "account")}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2"
                        >
                          {copied === "account" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-300 font-medium">Account Name:</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-lg">{accountDetails.accountName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(accountDetails.accountName, "name")}
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-2"
                        >
                          {copied === "name" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Instructions */}
                <Card className="p-4 bg-blue-500/10 border-blue-500/20 text-left">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm mr-2">
                      💡
                    </span>
                    How to Send Your Gift:
                  </h4>
                  <ol className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white mr-3 mt-0.5 flex-shrink-0">
                        1
                      </span>
                      Copy the account details above using the copy buttons
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white mr-3 mt-0.5 flex-shrink-0">
                        2
                      </span>
                      Open your banking app, OPay, or visit any bank
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white mr-3 mt-0.5 flex-shrink-0">
                        3
                      </span>
                      Send your chosen gift amount to the account
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white mr-3 mt-0.5 flex-shrink-0">
                        4
                      </span>
                      Fill out the notification form to let Ritchie know
                    </li>
                    <li className="flex items-start">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white mr-3 mt-0.5 flex-shrink-0">
                        5
                      </span>
                      Optionally send a WhatsApp confirmation message
                    </li>
                  </ol>
                </Card>

                <Button
                  onClick={() => window.open(whatsappUrl, "_blank")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold rounded-full smooth-hover"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send WhatsApp Confirmation
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Gift Form Section */}
          <div className="space-y-6">
            <Card className="p-6 md:p-8 bg-white/10 backdrop-blur-md border-white/20 smooth-hover">
              <form onSubmit={handleSubmitGift} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Gift Notification</h3>
                  <p className="text-gray-300">Let Ritchie know about your generous gift</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Your Name</label>
                    <Input
                      placeholder="Enter your full name"
                      value={giftForm.name}
                      onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={giftForm.email}
                      onChange={(e) => setGiftForm({ ...giftForm, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Gift Amount (NGN)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-bold">
                        ₦
                      </span>
                      <Input
                        type="number"
                        placeholder="5,000"
                        value={giftForm.amount}
                        onChange={(e) => setGiftForm({ ...giftForm, amount: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4 pl-10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        min="100"
                        step="50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Payment Method</label>
                    <select
                      value={giftForm.paymentMethod}
                      onChange={(e) => setGiftForm({ ...giftForm, paymentMethod: e.target.value })}
                      className="w-full p-4 bg-white/10 border border-white/20 text-white rounded-md text-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    >
                      <option value="opay">OPay Transfer</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="kuda">Kuda Bank</option>
                      <option value="gtbank">GTBank</option>
                      <option value="access_bank">Access Bank</option>
                      <option value="zenith_bank">Zenith Bank</option>
                      <option value="first_bank">First Bank</option>
                      <option value="uba">UBA</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Personal Message (Optional)</label>
                    <Textarea
                      placeholder="Write a special birthday message for Ritchie..."
                      value={giftForm.message}
                      onChange={(e) => setGiftForm({ ...giftForm, message: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-lg p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-4 text-lg font-semibold rounded-full smooth-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Notification...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Notify Ritchie of Gift 🎁
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Gift Suggestions */}
        <Card className="mt-12 p-6 md:p-8 bg-white/10 backdrop-blur-md border-white/20 smooth-hover">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">Suggested Gift Amounts 💰</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { amount: "₦1,000", desc: "Sweet gesture", color: "from-blue-500 to-purple-600" },
              { amount: "₦2,500", desc: "Thoughtful gift", color: "from-green-500 to-blue-600" },
              { amount: "₦5,000", desc: "Generous gift", color: "from-yellow-500 to-orange-600" },
              { amount: "₦10,000+", desc: "Amazing surprise", color: "from-pink-500 to-red-600" },
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() =>
                  setGiftForm({
                    ...giftForm,
                    amount: suggestion.amount.replace("₦", "").replace(",", "").replace("+", ""),
                  })
                }
                className="p-6 border-white/20 text-white hover:bg-white/10 flex flex-col items-center space-y-3 smooth-hover h-auto"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${suggestion.color} flex items-center justify-center`}
                >
                  <span className="text-white font-bold">₦</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-yellow-400 block">{suggestion.amount}</span>
                  <span className="text-sm text-gray-300">{suggestion.desc}</span>
                </div>
              </Button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              💡 <strong>Tip:</strong> Any amount is appreciated! Your love and thoughtfulness matter most.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
