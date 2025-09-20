"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoading } from "../providers/LoadingProvider";

export const PricingSection = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { setGlobalLoading } = useLoading();
  const router = useRouter();

  const handlePlanSelect = async (planName: string, buttonText: string) => {
    setLoadingPlan(planName);
    
    if (buttonText === "Contact Sales") {
      setGlobalLoading(true, "Opening contact form...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to contact or open modal
      window.open('mailto:sales@cloudmorph.dev', '_blank');
      setGlobalLoading(false);
    } else if (buttonText === "Start Free Trial") {
      setGlobalLoading(true, "Starting your free trial...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/auth/signup?plan=pro');
    } else {
      setGlobalLoading(true, "Setting up your account...");
      await new Promise(resolve => setTimeout(resolve, 1200));
      router.push('/auth/signup?plan=hobby');
    }
    
    setLoadingPlan(null);
  };

  const pricingPlans = [
    {
      name: "Hobby",
      price: "Free",
      description: "Perfect for personal projects",
      features: [
        "3 projects",
        "100GB bandwidth",
        "Community support",
        "SSL certificates",
        "Basic analytics"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Best for growing teams",
      features: [
        "Unlimited projects",
        "1TB bandwidth", 
        "Priority support",
        "Advanced analytics",
        "Custom domains",
        "Team collaboration",
        "Preview deployments"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited bandwidth",
        "24/7 phone support",
        "SSO integration",
        "Custom SLA",
        "Dedicated account manager",
        "On-premise option"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">Simple Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`glass-card p-8 rounded-xl backdrop-blur-xl transition-all duration-500 h-full ${
                plan.popular 
                  ? 'bg-white/8 border-2 border-purple-500/30 hover:border-purple-500/50' 
                  : 'bg-white/3 border border-white/8 hover:border-white/15'
              }`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => handlePlanSelect(plan.name, plan.buttonText)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-3 px-6 rounded-xl font-semibold backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-400 hover:to-blue-400 shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={loadingPlan !== plan.name ? { scale: 1.02 } : {}}
                  whileTap={loadingPlan !== plan.name ? { scale: 0.98 } : {}}
                >
                  {loadingPlan === plan.name ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};